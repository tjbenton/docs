/*
  eslint
  no-undef: 0,
  prefer-arrow-callback: 0
 */
var docs = require('./docs.js')

// Module exports
// a) export module
// b) define amd
// c) add docs to the root
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = docs
  }
  exports.docs = docs
} else if (typeof define === 'function' && define.amd) { // AMD definition
  define(() => docs)
} else {
  root.docs = docs
}
