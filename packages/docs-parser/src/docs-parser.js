'use strict'

import path from 'path'
import fs from 'fs-extra-promisify'
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
export default async function docsParser(options = {}, callback) {
  options = await getConfig(options)

  /* eslint-disable no-unused-vars */
  // these are all the options that can be used
  let {
    files: initial_files,
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

  const root = process.cwd()

  let walk = async (files) => {
    files = to.array(files)

    logger.emit('start', 'total')
    try {
      logger.emit('start', 'paths')
      files = await globby(files, { ignore, nodir: true })

      let paths_message = `%s completed ${to.map(files, (file) => clor.bold(file.replace(process.cwd() + '/', ''))).join(', ')} after %dms`
      if (files.length > 3) {
        let s = files.length > 1 ? 's' : '' // eslint-disable-line
        paths_message = `%s completed after %dms with ${files.length} file${s} to parse`
      }
      logger.emit('complete', 'paths', paths_message)

      logger.emit('start', 'parser')
      options.annotationsApi = annotations

      const parse = async ({ file, type }) => {
        return {
          [file]: await parsers[type].parse(file)
        }
      }


      const parser_options = { page_fallback, blank_lines, indent, annotations, sort, log: logger }
      const parsed_files = await map(files, (file) => {
        const type = path.extname(file).replace('.', '')
        if (!parsers[type]) {
          parsers[type] = new Parser(languages[type] || languages.default, type, parser_options)
        }

        return parse({ file, type })
      })

      logger.emit('complete', 'parser')

      // Loop through the parsed files and update the
      // json data that was stored.
      for (let file of parsed_files) {
        to.extend(json, file)
      }

      let result = json

      if (!raw) {
        logger.emit('start', 'sorter')
        result = sorter({ json, page_fallback, log: logger })
        logger.emit('complete', 'sorter')
      }

      logger.emit('complete', 'total')
      timestamps && logger.space()

      logger.emit('parsed', result, files)

      if (typeof callback === 'function') {
        callback(result, files)
      } else if (watch) {
        console.log('updated: ', dest)
        await fs.outputJson(dest, result)
      }

      return result
    } catch (err) {
      logger.error(err.stack)
    }
  }


  let result = await walk(initial_files)

  if (!watch) {
    return result
  }

  initial_files = await globby(initial_files, { ignore, nodir: true })
  initial_files = initial_files.map((file) => !path.isAbsolute(file) ? path.join(root, file) : file)

  let watcher = chokidar.watch(initial_files, { persistent: true, ignoreInitial: true })

  logger.space()
  logger.print('Watching', to.map(initial_files, (file) => clor.bold(file.replace(`${root}/`, ''))).join(', '))
  logger.print('Excluding', to.map(ignore, (file) => clor.bold(file.replace(`${root}/`, ''))).join(', '))
  logger.space()

  watcher.on('all', async (type, file) => {
    if (
      type === 'add' ||
      type === 'changed' ||
      type === 'change'
    ) {
      try {
        await walk(file)
      } catch (err) {
        logger.emit('error', file, 'was not updated', err)
      }
    }
  })

  return watcher
}

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  // handle the error safely
  console.log(err)
})
