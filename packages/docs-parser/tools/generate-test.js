#!/usr/bin/env node
/* eslint-disable prefer-arrow-callback, func-names, no-shadow, babel/object-shorthand */
'use strict'


var docs = require('..').default
var Tokenizer = require('../dist/parser/tokenizer.js').default
var path = require('path')
var clor = require('clor')
var utils = require('../dist/utils')
var argv = process.argv.slice(2)
const root = process.cwd()

utils.glob(argv, [ 'tests/**/*.json' ])
  .then(function(files) {
    var promises = []
    for (var i = 0; i < files.length; i++) {
      promises.push(sortTest(path.join(root, files[i])))
    }

    return Promise.all(promises)
  })
  .then(function(parsed) {
    for (var i = 0; i < parsed.length; i++) {
      console.log('   ', (i + 1) + ':', parsed[i])
    }
  })



function sortTest(file) {
  var type = file.match(/(?:tests\/)([a-z\-]*)/)[1]

  switch (type) {
    case 'cases':
    case 'file-types':
      return caseTest(file)
    case 'tokenizer':
      return tokenizerTest(file)
    case 'annotations':
      return annotationTest(file)
    default:
      return Promise.resolve(clor.yellow(file + " isn't a test"))
  }
}

function output(file, data) {
  return utils.fs.outputJson(
    file.replace(path.extname(file), '.json'),
    data,
    { spaces: 2 }
  )
}


function annotationTest(file) {
  return new Promise(function(resolve) {
    docs({
      files: file,
      warning: false,
      debug: false,
      timestamps: false,
      raw: true,
      ignore: '.*'
    })
    .then(function(parsed) {
      return output(file, parsed[file])
    })
    .then(function() {
      resolve(clor.green(file) + '')
    })
    .catch(function(err) {
      console.trace(err)
      resolve(clor.red(file) + '')
    })
  })
}



function caseTest(file) {
  return new Promise(function(resolve) {
    docs({
      files: file,
      warning: false,
      debug: false,
      timestamps: false,
      ignore: '.*'
    })
    .then(function(parsed) {
      return output(file, parsed)
    })
    .then(function() {
      resolve(clor.green(file) + '')
    })
    .catch(function(err) {
      console.trace(err)
      resolve(clor.red(file) + '')
    })
  })
}


var tokenizerHelper = require('../tools/tokenizer-helper.js')
function tokenizerTest(file) {
  return new Promise(function(resolve) {
    tokenizerHelper(file)
      .then(function(obj) {
        let result
        try {
          result = new Tokenizer(obj.str, obj.comment)
        } catch (e) {
          console.trace(e.stack)
        }
        return output(file, result)
      })
      .then(function() {
        resolve(clor.green(file) + '')
      })
      .catch(function(err) {
        console.trace(err)
        resolve(clor.red(file) + '')
      })
  })
}
