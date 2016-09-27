'use strict'

import globby from 'globby'
import fs from 'fs-extra-promisify'
import docsParser from 'docs-parser'
import logger from 'docs-helpers-logger'
import to, { is } from 'to-js'
import config from './config'
import path from 'path'
import harp from 'harp'
import { forEach, map } from 'async-array-methods'
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
    to.extend(global, this.options.global)
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
      let page_data = {}
      const sortPages = (data, prefix) => {
        const result = page_data
        for (let { name, page, i, ...rest } of to.objectEntries(data, 'name')) { // eslint-disable-line
          if (prefix) {
            name = path.join(prefix, name)
          }
          if (!result[name]) {
            result[name] = {}
          }

          if (!is.empty(rest)) {
            sortPages(rest, name)
          }
          result[name] = to.merge(result[name], page)
        }

        return result
      }

      docsParser(options).catch(reject)

      logger.on('parsed', (json) => {
        page_data = {}
        const sorted_pages = sortPages(json.pages)
        const write_json = fs.outputJson(path.join(this.public, '_data.json'), json).catch(reject)
        const write_pages = forEach(to.keys(sorted_pages), async (folder) => {
          let data = folder.split(path.sep)
          let relative = data.map(() => '..').join(path.sep)
          data = 'public' + data.map((item) => `['${item}']`).join('') + '._data'
          return await Promise.all([
            fs.outputJson(path.join(this.public, folder, '_data.json'), sorted_pages[folder]),
            fs.outputFile(path.join(this.public, folder, 'index.jade'),
              `!= partial('${path.join(relative, '_layout', 'annotation')}', ${data})\n`)
          ])
        })

        Promise.all([ write_json, write_pages ]).then(resolve).catch(reject)
      })
    })
  }

  async copy(glob, callback, watch = false) {
    const files = await this.findFiles(glob)

    const copy = async (file) => {
      let dest
      try {
        dest = await callback(file)
        if (dest) {
          await fs.copy(file, dest, { clobber: true })
        }
      } catch (err) {
        logger.emit('error', file, `was not copied ${dest ? 'into ' + dest : 'correctly'}`, err)
      }
    }

    if (watch) {
      chokidar
        .watch(glob, { persistent: true, ignoreInitial: true })
        .on('add', copy)
        .on('change', copy)
        .on('error', logger.error)
    }

    await forEach(files, copy)
  }

  assets(watch) {
    let copied = {}

    const position = (file) => {
      for (let i = 0; i < this.options.assets.length; i++) {
        if (file.indexOf(this.options.assets[i]) > -1) return i
      }
      return false
    }

    return this.copy(this.options.assets, (file) => {
      const pos = position(file)
      const { dir, base } = path.parse(file.replace(this.options.assets[pos] + path.sep, ''))
      const relative = path.join(dir, base)
      const dest = path.join(this.public, relative)
      const existing = copied[relative]

      if (
        !!!existing || // is undefined
        existing === file || // is the same as the existing file
        position(existing) >= pos // the existing one has less importance than the passed in file
      ) {
        copied[relative] = file
        return dest
      }

      return false
    }, watch)
  }

  projectAssets(watch) {
    return this.copy(this.options.project_assets, (file) => {
      const relative = file.replace(this.options.project_assets + path.sep, '')
      return path.join(this.public, 'project', relative)
    }, watch)
  }

  async run(watch) {
    try {
      await fs.remove(this.public)
      await Promise.all([
        this.projectAssets(watch),
        this.assets(watch),
        this.parse(watch)
      ])
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
    } catch (err) {
      logger.error('harp compile', err)
      process.exit(1)
    }
  }
}
