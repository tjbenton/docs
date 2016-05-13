/*
  eslint
  no-undef: 0,
  prefer-arrow-callback: 0
 */
var docsParser = require('./docs-parser.js')

// Module exports
// a) export module
// b) define amd
// c) add docs to the root
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = docsParser
  }
  exports.docsParser = docsParser
} else if (typeof define === 'function' && define.amd) { // AMD definition
  define(() => docsParser)
} else {
  root.docsParser = docsParser
}
