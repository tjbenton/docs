/* eslint
  no-var: 0,
  no-unused-vars: 0,
  no-shadow: 0,
  prefer-arrow-callback: 0,
  max-params: 0,
  id-length: 0,
  prefer-template: 0
*/
var stylus = require('stylus');
var utils = stylus.utils;
var fs = require('fs');
var path = require('path');

module.exports = function plugin() {
  return function plugin(style) {
    style.define('svg-import', function svg_import(url) {
      url = path.join(process.cwd(), 'public', 'styles', url.val);
      var result = fs.readFileSync(url, 'utf8');
      return result
        .split('\n')
        .map(function trim(str) {
          return str.trim();
        })
        .join('')
        .replace(/["/#%]/g, function replaceSpecialCharacters(m) {
          return {
            '/': '%2f',
            '#': '%23',
            '%': '%25',
            '"': '\''
          }[m];
        });
    });
  };
};
