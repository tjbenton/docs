
/* eslint-disable prefer-arrow-callback, func-names, no-shadow, babel/object-shorthand */
'use strict'
require('babel-register')

// var docs = require('..').default
// var Tokenizer = require('../dist/parser/tokenizer.js').default
// var path = require('path')
// var clor = require('clor')

// var fs = require('fs-extra-promisify')
import globby from 'globby'
const argv = process.argv.slice(2)
const root = process.cwd()
import path from 'path'
import to from 'to-js'
function log(...args) {
  console.log(to.normalize(args.join('\n')))
}

export default async function createTest() {
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

  let files = await globby(globs, { ignore: 'tests/**/*.json', nodir: true })
  let promises = []

  // console.log('first', files[0]);
  // console.log('base', base);
  // console.log('new state', files[0].replace(base, ''));

  for (let file of files) {
    promises.push(run(file))
  }

  promises = await Promise.all(promises)


  function run(file) {
    let name = file.replace(base, '').split(path.sep).filter(Boolean)[0]

    return Promise.resolve(name)
  }

  console.log(promises)
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
