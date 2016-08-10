'use strict'

import path from 'path'
import to, { is } from 'to-js'
import Parser from './parser'
import sorter from './sorter'
import getConfig from './config'
import array, { map } from 'async-array-methods'
import chokidar from 'chokidar'
import clor from 'clor'
import globby from 'globby'
import logger from 'docs-helpers-logger'

export { debug } from './utils'

export {
  Parser,
  getConfig,
  array,
  to,
  is
}

////
/// @name docs.js
/// @author Tyler Benton
/// @description
/// This is used to parse any filetype that you want to and gets the
/// documentation for it  and returns an `{}` of the document data
////
async function docsParser(options = {}, callback) {
  options = await getConfig(options)

  /* eslint-disable no-unused-vars */
  // these are all the options that can be used
  let {
    files: globs,
    ignore,
    blank_lines,
    page_fallback,
    dest,
    debug,
    warning,
    timestamps,
    raw,
    indent,
    sort,
    annotations,
    watch,
    languages,
  } = options
  /* eslint-enable no-unused-vars */
  logger.options.debug = debug
  logger.options.warning = warning
  logger.options.timestamps = timestamps

  let json = {}
  let parsers = {}
  const parser_options = { page_fallback, blank_lines, indent, annotations, sort, log: logger }
  const root = process.cwd()
  const watcher = chokidar.watch(globs, { persistent: true, ignoreInitial: true })

  const parse = async (file, should_log = false) => {
    try {
      should_log && logger.emit('start', 'parser')
      const ext = path.extname(file).replace('.', '')
      let parser = parsers[ext]
      if (!parser) {
        parser = parsers[ext] = new Parser(languages[ext] || languages.default, ext, parser_options)
      }

      json[file] = await parser.parse(file)
      should_log && logger.emit('complete', 'parser')
    } catch (err) {
      logger.emit('error', file, 'was not updated', err)
    }
  }

  const sortdata = () => {
    if (raw) {
      return json
    }
    logger.emit('start', 'sorter')
    const result = sorter({ json, page_fallback, log: logger })
    logger.emit('complete', 'sorter')
    return result
  }

  const parsefile = async (file) => {
    logger.emit('start', 'total')
    if (!json[file]) {
      file = file.replace(`${root}${path.sep}`, '')
    }
    await parse(file, true)
    const result = sortdata()
    logger.emit('complete', 'total')
    logger.emit('parsed', result, [ file ])

    if (typeof callback === 'function') {
      callback(result, [ file ])
    }

    return result
  }

  const parsefiles = async (_globs) => {
    logger.emit('start', 'total')
    let files = await map(_globs, (glob) => globby(glob, { ignore, nodir: true }))
    files = to.flatten(files)
    logger.emit('start', 'parser')
    await map(files, parse)
    logger.emit('complete', 'parser')
    const result = sortdata()
    logger.emit('complete', 'total')
    logger.emit('parsed', result, files)

    if (typeof callback === 'function') {
      callback(result, files)
    }

    return result
  }

  const result = await parsefiles(globs)

  if (!watch) {
    watcher.close()
    return result
  }

  logger.space()
  logger.print('Watching', to.map(globs, (file) => clor.bold(file)).join(', '))
  logger.print('Excluding', to.map(ignore, (file) => clor.bold(file)).join(', '))
  logger.space()

  watcher
    .on('add', parsefile)
    .on('change', parsefile)

  return watcher
}


docsParser.on = (name, ...args) => logger.on(name, ...args)
docsParser.emit = (name, ...args) => logger.emit(name, ...args)

export default docsParser

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  // handle the error safely
  console.log(err)
})
