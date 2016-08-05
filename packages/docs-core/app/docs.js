'use strict'

/* eslint-disable */
import globby from 'globby'
import fs from 'fs-extra-promisify'
import docsParser from 'docs-parser'
import logger from 'docs-helpers-logger'
import to, { is } from 'to-js'
import config from './config'
import path from 'path'
import harp from 'harp'
import { forEach, map, reduce } from 'async-array-methods'
import chokidar from 'chokidar'

harp._compile = harp.compile
harp.compile = (...args) => {
  return new Promise((resolve, reject) => harp._compile(...args, (err, output) => err ? reject(err) : resolve(output)))
}

harp._server = harp.server
harp.server = (...args) => {
  return new Promise((resolve) => harp._server(...args, (...rest) => resolve(...rest)))
}

export default class Docs {
  constructor(options = {}) {
    this.options = config(options)
    this.cwd = process.cwd()
    this.public = path.join(this.cwd, 'node_modules', 'docs-core', 'public')
  }

  async findFiles(folders) {
    const files = []
    const sort = (list) => {
      const to_search = []
      list = to.flatten(list)
      for (let item of list) {
        if (!!path.extname(item)) {
          files.push(item)
        } else {
          to_search.push(item)
        }
      }
      return to_search
    }
    const find = async (_folders) => {
      _folders = sort(await map(_folders, (folder) => globby(path.join(folder, '*'))))
      if (_folders.length) {
        return find(_folders)
      }
    }

    await find(to.array(folders))
    return files
  }

  parse(watch = false) {
    return new Promise((resolve, reject) => {
      const options = { ...this.options }
      options.watch = watch
      options.raw = false

      const sortPages = (data, prefix) => {
        const page_data = {}
        for (let { name, page, i, ...rest } of to.objectEntries(data, 'name')) {
          if (prefix) {
            name = path.join(prefix, name)
          }
          if (!page_data[name]) {
            page_data[name] = {}
          }

          if (!is.empty(rest)) {
            sortPages(rest, name)
          }
          page_data[name] = to.merge(page_data[name], page)
        }

        return page_data
      }

      docsParser(options).catch(reject)

      logger.on('parsed', (json, files) => {
        const page_data = sortPages(json.pages)
        const write_json = fs.outputJson(path.join(this.public, '_data.json'), json).catch(reject)
        const write_pages = forEach(to.keys(page_data), async (folder) => {
          let data = folder.split(path.sep)
          let relative = data.map((i) => '..').join(path.sep)
          data = 'public' + data.map((item) => `['${item}']`).join('') + '._data'
          return await Promise.all([
            fs.outputJson(path.join(this.public, folder, '_data.json'), page_data[folder]),
            fs.outputFile(path.join(this.public, folder, 'index.jade'),
              `!= partial('${path.join(relative, '_layout', 'annotation')}', ${data})` + '\n')
          ])
        })

        Promise.all([ write_json, write_pages ]).then(resolve).catch(reject)
      })
    })
  }

  assets(watch = false) {
    return new Promise((resolve, reject) => {
      let copied = {}

      const position = (file) => {
        for (let i = 0; i < this.options.assets.length; i++) {
          if (file.indexOf(this.options.assets[i]) > -1) return i
        }
        return false
      }

      const copy = async (file) => {
        const pos = position(file)
        const { dir, base } = path.parse(file.replace(this.options.assets[pos] + path.sep, ''))
        const relative = path.join(dir, base)
        const to = path.join(this.public, relative)
        const existing = copied[relative]

        if (
          !!!existing || // is undefined
          existing === file || // is the same as the existing file
          position(existing) >= pos // the existing one has less importance than the passed in file
        ) {
          copied[relative] = file
          try {
            await fs.copy(file, to, { clobber: true })
          } catch (err) {
            reject(err)
            logger.emit('error', file, 'was not copied to the public folder', err)
          }
        }

        return false
      }

      this.findFiles(this.options.assets)
        .then((files) => forEach(files, copy))
        .then(resolve)
        .then(() => {
          if (watch) {
            const watcher = chokidar.watch(this.options.assets, { persistent: true, ignoreInitial: true })
            watcher
              .on('add', copy)
              .on('change', copy)
              .on('error', (err) => reject(logger.error(err)))
          }
        })
    })
  }

  async run(watch) {
    try {
      await fs.remove(this.public)
      await Promise.all([ this.assets(watch), this.parse(watch) ])
    } catch (e) {
      logger.error(e)
    }
  }

  async server({ ip = '127.0.0.1', port = 4444 }) {
    await this.run(true)

    try {
      await harp.server(this.public, { ip, port })
      const address = ip === '0.0.0.0' || ip === '127.0.0.1' ? 'localhost' : ip
      logger.print(`Your server is listening at http://${address}:${port}`)
    } catch (err) {
      logger.error('harp server', err)
      process.exit(1)
    }
  }

  async compile(output) {
    output = path.isAbsolute(output) ? output : path.join(this.cwd, output)
    await this.run()

    try {
      await harp.compile(this.public, output)
    } catch (e) {
      logger.error('harp compile', err)
      process.exit(1)
    }
  }
}
