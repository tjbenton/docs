////
/// @author Tyler Benton
/// @description
/// A few additional helper functions for the fantastic [`is.js`](https://github.com/arasatasaygin/is.js/blob/master/is.js) library.
/// @page utils/is
////

const toString = (arg) => Object.prototype.toString.call(arg)

import to from './to.js'
import is from 'is_js'

/// @name is.false
/// @description is a given arg false
/// @arg {*} arg - arg to check if it is false
/// @returns {boolean}
is.false = (arg) => arg === false

/// @name is.false
/// @alias is.function
/// @description is a given arg a function
/// @arg {*} arg - arg to check if it is a function
/// @returns {boolean}
is.fn = is.function

/// @name is.in
/// @description is the `value` in `obj`?
/// @arg {array, string, object} obj - the item to check against
/// @arg {*} value - the value to look for in the `obj`
/// @returns {boolean}
is.in = (obj, value) => (is.plainObject(obj) ? to.keys(obj) : obj).indexOf(value) > -1


/// @name is.plainObject
/// @description is the `value` in `obj`?
/// @arg {array, string, object} obj - the item to check against
/// @arg {*} value - the value to look for in the `obj`
/// @returns {boolean}
is.plainObject = (arg) => toString(arg) === '[object Object]'


/// @name is.between
/// @description is a given number within minimum and maximum parameters?
/// @arg {*} arg
/// @arg {number} min [0]
/// @arg {number} max [Infinity]
/// @returns {boolean}
is.between = (arg, min = 0, max = Infinity) => is.all.number(arg, min, max) && (arg >= min && arg <= max)

/// @name is.promise
/// @description is a given arg a promise?
/// @arg {*} arg - the item you want to check and see if it's a `Promise`
/// @returns {boolean}
is.promise = (arg) => arg && is.fn(arg.then)

/// @name is.buffer
/// @description is a given arg a stream?
/// @arg {*} arg - the item you want to check and see if it's a `stream`
/// @returns {boolean}
is.buffer = (arg) => Buffer.isBuffer(arg)

/// @name is.included
/// @description is a given string include parameter substring?
/// @arg {string, array} a - string to match against
/// @arg {string, array} b - string to look for in `str`
/// @returns {number, boolean}
/// @todo {10} remove this because it doesn't really fit with the `is` library
is.included = (a, b) => !is.empty(a) && !is.empty(b) && a.indexOf(b) > -1 ? a.indexOf(b) : false

/// @name is.symbol
/// @description is a given arg a symbol?
/// @arg {*} arg - The item to check
/// @returns {boolean} - The result of the test
is.symbol = (arg) => typeof arg === 'symbol'

is.all.in = (obj, ...values) => {
  values = to.flatten(values)
  for (let i in values) {
    if (!is.in(obj, values[i])) {
      return false
    }
  }
  return true
}

is.any.in = (obj, ...values) => {
  values = to.flatten(values)
  for (let i in values) {
    if (is.in(obj, values[i])) {
      return true
    }
  }
  return false
}


export default is
