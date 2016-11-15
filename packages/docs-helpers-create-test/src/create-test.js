'use strict'
require('babel-register')({
  presets: [ 'latest', 'stage-0' ],
  plugins: [ 'transform-runtime' ]
})

import fs from 'fs-extra-promisify'
import globby from 'globby'
const argv = process.argv.slice(2)
const root = process.cwd()
import path from 'path'
import to from 'to-js'
import clor from 'clor'
function log(...args) {
  console.log(to.normalize(args.join('\n')))
}

export default async function createTest() { // eslint-disable-line
  let _root = root.split(path.sep)
  _root = _root.slice(0, _root.indexOf('docs') + 1).join(path.sep)
  if (argv.indexOf('-h') > -1 || argv.indexOf('--help') > -1) {
    log('')
    return log(`
      Usage: create-test <package> [globs...]
    `)
    log('')
    log('')
  }

  let pkg = argv[0]
  let base = path.join(_root, 'packages', pkg, 'test', 'compare')
  let create
  try {
    create = require(path.join(base, 'create.js'))
  } catch (e) {
    try {
      base = path.join(_root, 'packages', pkg, 'tests', 'compare')
      create = require(path.join(base, 'create.js'))
    } catch (err) {
      log(`You must add a 'create.js' to ${base} with the name of the folder that you're creating tests for`)
      return
    }
  }

  let globs = argv.slice(1)
  if (!globs.length) {
    globs = [ '*/**/*' ]
  }

  globs = globs
    .join(',')
    .split(',')
    .filter(Boolean)
    .map((glob) => glob.trim().replace(/\/|\\/g, path.sep))
    .map((glob) => path.join(base, glob))


  // get all the files to test
  const files = await globby(globs, { ignore: [ '**/*.json' ], nodir: true })

  // placeholder for the created test cases
  let parsed = []

  // loop over each file and create the data
  for (let file of files) {
    parsed.push(run(file))
  }

  parsed = await Promise.all(parsed)
  async function run(file) {
    let name = file.match(/(?:tests?\/compare\/)([a-z\-]*)/)[1]
    let fn = create[to.camelCase(name)]
    let log_file = file.replace(path.join(_root, ''), 'docs')
    let result = { file, log_file }
    if (typeof fn !== 'function') {
      result.nottest = true
      return result
    }

    let data
    try {
      data = await fn(result)
    } catch (err) {
      result.error = true
      result.trace = err
      return result
    }

    try {
      await output(file, data)
    } catch (err) {
      result.message = `${clor.red('something went wrong while trying to write the file to')}`
      result.error = true
      return result
    }

    result.success = true
    return result
  }


  function output(file, data) {
    return fs.outputJson(
      file.replace(path.extname(file), '.json'),
      data,
      { spaces: 2 }
    )
  }

  let spacer = '    '
  for (var i = 0; i < parsed.length; i++) {
    let item = parsed[i]
    item.index = i + 1
    let { message, log_file, error, success, trace, index, nottest } = item

    if (success) {
      console.log(spacer, index, `${clor.green('(created)')}:`, log_file)
    } else if (error) {
      console.log(spacer, index, `${clor.red('(error)')}:`, log_file)
    } else if (nottest) {
      console.log(spacer, index, `${clor.red("(isn't a test)")}:`, log_file)
    }

    if (message) {
      console.log(spacer, message)
    }

    if (trace) {
      console.trace(trace)
    }
  }

  process.exit(0)
}
