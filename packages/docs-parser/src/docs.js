'use strict'

import path from 'path'
import {
  fs,
  to,
  glob,
} from './utils'
import Parser from './parser'
import sorter from './sorter'
import getConfig from './config'
import array, { map } from 'async-array-methods'
import chokidar from 'chokidar'
import clor from 'clor'

export {
  fs,
  glob,
  is,
  to,
  debug
} from './utils'

export {
  Parser,
  getConfig,
  array
}

////
/// @name docs.js
/// @author Tyler Benton
/// @description
/// This is used to parse any filetype that you want to and gets the
/// documentation for it  and returns an `{}` of the document data
////
export default async function docs(options = {}, callback) {
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
    log,
  } = options
  /* eslint-enable no-unused-vars */

  let json = {}
  let parsers = {}
  const ignored = await glob(ignore)
  const root = process.cwd()

  let walk = async (files) => {
    files = to.array(files)

    log.emit('start', 'total')
    try {
      log.emit('start', 'paths')
      files = await glob(files, ignored)

      let paths_message = `%s completed ${to.map(files, (file) => clor.bold(file.replace(process.cwd() + '/', ''))).join(', ')} after %dms`
      if (files.length > 3) {
        let s = files.length > 1 ? 's' : '' // eslint-disable-line
        paths_message = `%s completed after %dms with ${files.length} file${s} to parse`
      }
      log.emit('complete', 'paths', paths_message)

      log.emit('start', 'parser')
      options.annotationsApi = annotations

      const parse = async ({ file, type }) => {
        return {
          [file]: await parsers[type].parse(file)
        }
      }


      const parser_options = { page_fallback, blank_lines, indent, annotations, sort, log }
      const parsed_files = await map(files, (file) => {
        const type = path.extname(file).replace('.', '')
        if (!parsers[type]) {
          parsers[type] = new Parser(languages[type] || languages.default, type, parser_options)
        }

        return parse({ file, type })
      })

      log.emit('complete', 'parser')

      // Loop through the parsed files and update the
      // json data that was stored.
      for (let file of parsed_files) {
        to.extend(json, file)
      }

      let result = json

      if (!raw) {
        log.emit('start', 'sorter')
        result = sorter({ json, page_fallback, log })
        log.emit('complete', 'sorter')
      }

      log.emit('complete', 'total')
      timestamps && log.space()

      if (typeof callback === 'function') {
        callback(result, files)
      } else if (watch) {
        console.log('updated: ', dest)
        await fs.outputJson(dest, result)
      }

      return result
    } catch (err) {
      log.error(err.stack)
    }
  }




  let result = await walk(initial_files)

  initial_files = initial_files.map((_glob) => !path.isAbsolute(_glob) ? path.join(root, _glob) : _glob)
  initial_files = await glob(initial_files, ignored)

  if (!watch) {
    return result
  }

  let watcher = chokidar.watch(initial_files, { ignored, persistent: true, ignoreInitial: true })

  log.space()
  log.print('Watching', to.map(initial_files, (file) => clor.bold(file.replace(`${root}/`, ''))).join(', '))
  log.print('Excluding', to.map(ignore, (file) => clor.bold(file.replace(`${root}/`, ''))).join(', '))
  log.space()

  watcher.on('all', async (type, file) => {
    if (
      type === 'add' ||
      type === 'changed' ||
      type === 'change'
    ) {
      try {
        await walk(file)
      } catch (err) {
        log.emit('error', file, 'was not updated', err)
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
