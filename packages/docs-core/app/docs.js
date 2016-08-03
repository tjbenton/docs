'use strict'

/* eslint-disable */
import globby from 'globby'
import fs from 'fs-extra-promisify'
import docsParser from 'docs-parser'
import logger from 'docs-helpers-logger'
import to from 'to-js'
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
  return new Promise((resolve) => harp._server(...args, (...args) => resolve(...args)))
}

export default class Docs {
  constructor(options = {}) {
    this.options = config(options)
    this.cwd = process.cwd()
    this.public = path.join(this.cwd, 'node_modules', 'docs-core', 'public')
  }

  async assetsList() {
    let assets = await reduce(this.options.assets.reverse(), async (list, folder) => {
      let files = await globby(path.join(folder, '**', '*'), { dot: true, nodir: true })

      files.forEach((from) => {
        const { dir, base } = path.parse(from.replace(folder + path.sep, ''))
        const to = path.join(this.public, dir, base)
        if (list.to.indexOf(to) < 0) {
          list.from.push(from)
          list.to.push(to)
        }
      })

      return list
    }, { from: [], to: [] })

    assets.from.reverse()
    assets.to.reverse()

    // await forEach(assets, ({ from, to }) => fs.copy(from, to, { clobber: true }))

    return assets
  }


  parse(watch = false) {
    return new Promise((resolve, reject) => {
      const options = { ...this.options }
      options.watch = watch

      docsParser(options)

      logger.on('parsed', (data, files) => {
        fs.outputJson(path.join(this.public, '_data.json'), data)
          .then(() => resolve(data))
          .catch(reject)
      })
    })
  }

  async assets(watch = false) {
    const { from, to } = await this.assetsList()

    const copy = (file) => fs.copy(file, to[from.indexOf(file)], { clobber: true })

    await map(from, copy)

    if (watch) {
      const watcher = chokidar.watch(from, { persistent: true, ignoreInitial: true })

      watcher.on('all', async (type, file) => {
        if ([ 'add', 'changed', 'change' ].indexOf(type) > -1) {
          try {
            await copy(file)
          } catch (err) {
            logger.emit('error', file, 'was not copied', err)
          }
        }
      })
    }
  }

  async run(watch) {
    await fs.remove(this.public)
    await Promise.all([
      this.assets(watch),
      this.parse(watch)
    ])
  }

  async server({ ip = '0.0.0.0', port = 9966 }) {
    await this.run(true)

    try {
      await harp.server(this.public, { ip, port })
    } catch (e) {
      logger.error('harp server', e)
      process.exit(1)
    }
  }

  async compile(output) {
    output = path.isAbsolute(output) ? output : path.join(this.cwd, output)
    await run()

    try {
      await harp.compile(this.public, output)
    } catch (e) {
      logger.error('harp compile', err)
      process.exit(1)
    }
  }
}