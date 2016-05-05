// this file is disabled because it has to use es5 syntax because it doesn't get compiled.
/* eslint-disable */

// This holds the different comment types to be used by the `tokenizer`.
// It's based off the folder path for example
// `comment_types['single-line'].slash` is for `tests/tokenizer/single-line/slash`
// If you need to add new tests with different comment types just add it to this
// object and create the folder path if needed, or just add your test to the correct
// folder and then generate them.
var comment_types = {
  'css-like': {
    'multi-single-line': {
      comment: { start: '', line: '///', end: '' }
    },
    'single-line': {
      comment: { start: '', line: '///#', end: '' }
    },
    'start-end': {
      comment: { start: '////', line: '///', end: '////' }
    },
  },
  'css': {
    'single-line': {
      comment: { start: '/*#', line: '', end: '*/' }
    },
    'start-end': {
      comment: { start: '/*', line: '*', end: '*/' }
    },
  },
  'hash-style': {
    'multi-single-line': {
      comment: { start: '', line: '##', end: '' }
    },
    'single-line': {
      comment: { start: '', line: '##$', end: '' }
    },
    'start-end': {
      comment: { start: '###', line: '##', end: '###' }
    },
  },
  'html': {
    'start-end': {
      comment: { start: '<!---', line: '', end: '--->' }
    },
    'single-line': {
      comment: { start: '<!---#', line: '', end: '--->' }
    }
  },
  'js': {
    'single-line': {
      comment: { start: '', line: '///', end: '' }
    },
    'start-end': {
      comment: { start: '////', line: '///', end: '////' }
    },
  },
}
var path = require('path')
var fs = require('fs')

function getTokenizerOption(file) {
  var type = file.split(/tests\//).pop().split(path.sep).slice(1, -1)
  var comment = type.reduce(function(prev, current) {
    var result =  (prev || {})[current]
    if (!result) {
      return (prev || {})[current.replace('-with-code', '')]
    }

    return result
  }, comment_types)

  return comment || {}
}

module.exports = exports = function tokenizerHelper(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, function(err, str) {
      if (err) {
        console.trace(err)
        reject(err)
      }
      str += ''

      resolve({
        str: str,
        comment: getTokenizerOption(file)
      })
    })
  })
}
