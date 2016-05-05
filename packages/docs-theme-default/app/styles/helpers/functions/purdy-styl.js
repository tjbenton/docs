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
var purdy = require('purdy');
var parser = stylus.render;
var nodes = stylus.nodes;
var utils = stylus.utils;

function unquote(str, quoteChar) {
  quoteChar = quoteChar || '"';
  if (str[0] === quoteChar && str[str.length - 1] === quoteChar) {
    return str.slice(1, str.length - 1);
  }

  return str;
};

function isNumeric(value) {
  return /^\d+$/.test(value);
};

function isBoolean(value) {
  return [ false, true, 'false', 'true' ].indexOf(value) > -1;
}

function fixValue(value) {
  if (value.params) {
    return fixFunction(value); // eslint-disable-line no-use-before-define
  }

  var val = unquote(utils.unwrap(value).toString().replace(/\(|\)|\\'/g, ''), '\'');
  if (value.vals) {
    return fixObject(value); // eslint-disable-line no-use-before-define
  } else if (isNumeric(val)) {
    return +val;
  } else if (isBoolean(val)) {
    return !!val;
  }

  return val;
}

function fixObject(obj) {
  var temp = {};
  for (var prop in obj.vals) {
    if (obj.vals.hasOwnProperty(prop)) {
      temp[prop] = fixValue(obj.vals[prop]);
    }
  }

  return temp;
}

function fixFunction(func) {
  var params;
  if (func.fn) {
    params = func.fn.toString().match(/^function *\w*\((.*?)\)/).slice(1).join(', ');
    return func.name + '(' + params + ')';
  }

  params = func.params.nodes.map(function fixParams(param) {
    return param.name + (param.rest ? '...' : '');
  }).join(', ');

  return func.name + '(' + params + ')';
}

module.exports = function plugin() {
  return function plugin(style) {
    // the rediculous arguments is because of a bug with stylus arguments
    style.define('purdy-styl', function log(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z) {
      var args = [].slice.call(arguments);

      if (args.length === 1 || typeof b === undefined) {
        args = fixValue(a);
      } else {
        args = args.map(function fix(arg) {
          return fixValue(arg);
        });
      }

      purdy(args, { indent: 2 });
      return null;
    });
  };
};
