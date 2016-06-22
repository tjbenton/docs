
/* eslint-disable prefer-arrow-callback, func-names, no-shadow, babel/object-shorthand */
'use strict'
require('babel-register')

// var docs = require('..').default
// var Tokenizer = require('../dist/parser/tokenizer.js').default
// var path = require('path')
// var clor = require('clor')

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
  let base = path.join(_root, 'packages', pkg, 'tests', 'compair')
  let globs = argv
    .slice(1)
    .join(',')
    .split(',')
    .filter(Boolean)
    .map((glob) => glob.trim().replace(/\/|\\/g, path.sep))
    .map((glob) => path.join(base, glob))

  let create
  try {
    create = require(path.join(base, 'create.js'))
  } catch (e) {
    log(`You must add a 'create.js' to ${base} with the name of the folder that you're creating tests for`)
    return
  }

  // get all the files to test
  let files = await globby(globs, { ignore: 'tests/**/*.json', nodir: true })
  files = files.filter((file) => path.extname(file) !== '.json')
  // placeholder for the created test cases
  let parsed = []

  // loop over each file and create the data
  for (let file of files) {
    parsed.push(run(file))
  }

  parsed = await Promise.all(parsed)

  async function run(file) {
    let name = file.match(/(?:tests\/compair\/)([a-z\-]*)/)[1]
    let fn = create[name]
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
}

//
// glob(argv, { ignore: 'tests/**/*.json', nodir: true })
//   .then(function(files) {
//     var promises = []
//     for (var i = 0; i < files.length; i++) {
//       promises.push(sortTest(path.join(root, files[i])))
//     }
//
//     return Promise.all(promises)
//   })
//   .then(function(parsed) {
//     for (var i = 0; i < parsed.length; i++) {
//       console.log('   ', (i + 1) + ':', parsed[i])
//     }
//   })
//
//
//
// function sortTest(file) {
//   var type = file.match(/(?:tests\/)([a-z\-]*)/)[1]
//
//   switch (type) {
//     case 'cases':
//     case 'file-types':
//       return caseTest(file)
//     case 'tokenizer':
//       return tokenizerTest(file)
//     case 'annotations':
//       return annotationTest(file)
//     default:
//       return Promise.resolve(clor.yellow(file + " isn't a test"))
//   }
// }
//
// function output(file, data) {
//   return fs.outputJson(
//     file.replace(path.extname(file), '.json'),
//     data,
//     { spaces: 2 }
//   )
// }
//
//
// function annotationTest(file) {
//   return new Promise(function(resolve) {
//     docs({
//       files: file,
//       warning: false,
//       debug: false,
//       timestamps: false,
//       raw: true,
//       ignore: '.*'
//     })
//     .then(function(parsed) {
//       return output(file, parsed[file])
//     })
//     .then(function() {
//       resolve(clor.green(file) + '')
//     })
//     .catch(function(err) {
//       console.trace(err)
//       resolve(clor.red(file) + '')
//     })
//   })
// }
//
//
//
// function caseTest(file) {
//   return new Promise(function(resolve) {
//     docs({
//       files: file,
//       warning: false,
//       debug: false,
//       timestamps: false,
//       ignore: '.*'
//     })
//     .then(function(parsed) {
//       return output(file, parsed)
//     })
//     .then(function() {
//       resolve(clor.green(file) + '')
//     })
//     .catch(function(err) {
//       console.trace(err)
//       resolve(clor.red(file) + '')
//     })
//   })
// }
//
//
// var tokenizerHelper = require('../tools/tokenizer-helper.js')
// function tokenizerTest(file) {
//   return new Promise(function(resolve) {
//     tokenizerHelper(file)
//       .then(function(obj) {
//         let result
//         try {
//           result = new Tokenizer(obj.str, obj.comment)
//         } catch (e) {
//           console.trace(e.stack)
//         }
//         return output(file, result)
//       })
//       .then(function() {
//         resolve(clor.green(file) + '')
//       })
//       .catch(function(err) {
//         console.trace(err)
//         resolve(clor.red(file) + '')
//       })
//   })
// }
