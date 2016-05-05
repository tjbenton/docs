const toString = (arg) => Object.prototype.toString.call(arg)
const arraySlice = (arg) => Array.prototype.slice.call(arg)

import markdown from 'marked'
import changeCase from 'change-case'
import is from './is.js'
import clone from 'clone'

let to = {
  /// @name to.markdown
  /// @description
  /// Helper function to convert markdown text to html
  /// For more details on how to use marked [see](https://www.npmjs.com/package/marked)
  /// @returns {string} of `html`
  markdown: (...args) => markdown(to.string(to.flatten(...args))),

  ...changeCase,

  /// @name to.type
  /// @description
  /// since `typeof` can't tell the difference between an array and an actual object
  /// this function will return the correct result
  /// @returns {string}
  type(arg) {
    let result = toString(arg).slice(8, -1).toLowerCase()

    if (result === 'uint8array') {
      return 'buffer'
    }

    return result
  },

  /// @name to.clamp
  /// @description
  /// This is used to clamp a number between a min an max value
  /// It ensures a number will always be between the passed values
  /// @returns {number}
  clamp(value, min = 0, max = Infinity) {
    if (value > max) {
      return max
    } else if (value < min) {
      return min
    }

    return value
  },

  /// @name to.random
  /// @description
  /// This function will return a random number or value depending on what it's passed
  /// @arg {array, object, number} - Item you want to get a random value or number from
  /// @returns {*}
  random(min = 0, max = 100) {
    let value
    let length = arguments.length

    switch (to.type(min)) {
      case 'number':
        if (min === max) {
          return min
        }
        return Math.floor(Math.random() * (max - min + 1)) + min
        break
      case 'array':
      case 'object':
        switch (length) {
          case 3:
            value = min
            min = max
            max = arguments[2]
            break
          case 2:
            value = min
            min = 0
            break
          case 1:
            value = min
            min = 0
            break
          default:
            throw new Error('a max of 3 params is allowed')
            break
        }
      case 'array': // eslint-disable-line
        if (length === 1) {
          max = value.length - 1
        }
        return value[to.random(min, max)]
        break
      case 'object':
        const keys = to.keys(value)
        if (length === 1) {
          max = keys.length - 1
        }
        return value[keys[to.random(min, max)]]
        break
      default:
        console.log(`${to.type(min)} is not allowed`)
        return min
    }
  },

  /// @name to.string
  /// @description
  /// Converts an object, array, number, or boolean to a string
  /// @arg {string, object, array, number, boolean}
  /// @returns {string}
  string(arg, glue = '\n') {
    if (is.string(arg)) {
      return arg
    }

    if (Buffer.isBuffer(arg)) {
      return arg + ''
    }

    if (is.plainObject(arg)) {
      return toString(arg)
    }

    if (is.array(arg)) {
      return arg.join(glue)
    }

    return arg + ''
  },


  /// @name to.normalString
  /// @description
  /// The ` + ""` converts the file from a buffer to a string
  ///
  /// The `replace` fixes a extremely stupid issue with strings, that is caused by shitty microsoft computers.
  /// It removes`\r` and replaces it with `\n` from the end of the line. If this isn't here then when `match`
  /// runs it will return 1 more item in the matched array than it should(in the normalize function)
  /// http://stackoverflow.com/questions/20023625/javascript-replace-not-replacing-text-containing-literal-r-n-strings
  ///
  /// @arg {*}
  /// @returns {string} That has microsoft crap removed from it
  normalString: (str) => to.string(str).replace(/\r\n|\n/g, '\n'),

  /// @name to.keys
  /// @description
  /// Converts an object to an array of it's key names.
  /// It also get's symbols if they're set as a key name.
  /// @arg {object}
  /// @returns {array}
  keys(arg) {
    if (!is.plainObject(arg) && !is.symbol(arg)) {
      return arg
    }

    return to.flatten([ Object.getOwnPropertySymbols(arg), Object.getOwnPropertyNames(arg) ])
  },

  /// @name to.keys
  /// @description
  /// Converts an object to an array of it's values names.
  /// @arg {object} arg - The object to get the values from
  /// @arg {string} ...rest - A list of values
  /// if you want to exclude a specific key you can use `!keyname`
  /// or if you want to only get specific values then you can pass in
  /// the specific values that you want to get. By default if ``...rest`
  /// is empty it will return all the values in the object.
  /// @returns {array}
  /// @markup Example:
  /// const obj = { one: 1, two: 2, three: 3 }
  /// to.values(obj) // [ 1, 2, 3 ]
  /// to.values(obj, '!two') // [ 1, 3 ]
  /// to.values(obj, 'two', 'three') // [ 2, 3 ]
  values(arg, ...rest) {
    let values = []
    let not = []
    let include = []

    for (let item of rest) {
      if (item.slice(0, 1) === '!') {
        not.push(item.slice(1))
      } else {
        include.push(item)
      }
    }

    let iterate = is.empty(include) ? to.keys(arg) : include

    for (var i = 0; i < iterate.length; i++) {
      if (!is.in(not, iterate[i])) {
        values.push(arg[iterate[i]])
      }
    }

    return values
  },

  /// @name to.entries
  /// @description
  /// Makes objects, and arrays easier to iterate over!
  ///
  /// @returns {Symbol.iterator}
  ///
  /// @markup {js} **Example:**
  /// let obj = {
  ///  first: "Jane",
  ///  last: "Doe"
  /// }
  ///
  /// for(let [key, value] of to.entries(obj)){
  ///  console.log(`${key}: ${value}`)
  /// }
  ///
  /// // Output:
  /// // first: Jane
  /// // last: Doe
  ///
  /// @markup {js} **Example:**
  /// let obj = ["Jane", "Doe"]
  ///
  /// for(let [index, value] of to.entries(obj)){
  ///  console.log(`${index}: ${value}`)
  /// }
  ///
  /// // Output:
  /// // 0: Jane
  /// // 1: Doe
  entries(obj, start = 0, end /* = item.length || to.keys(item).length */) {
    let i = start
    // this is what's returned when the iterator is done
    const done = { done: true }
    // this is the base iterator
    let iterator = {
      [Symbol.iterator]() {
        return this
      }
    }

    if (is.array(obj)) {
      if (is.undefined(end)) {
        end = obj.length
      }

      if (i < end) {
        iterator.next = () => {
          if (i < end) {
            return { value: [ i, obj[i++] ] }
          }
          return done
        }
      } else {
        iterator.next = () => {
          if (i > end) {
            return { value: [ i, obj[i--] ] }
          }
          return done
        }
      }

      return iterator
    }

    // In ES6, you can use strings or symbols as property keys,
    // Reflect.ownKeys() retrieves both. But the support it is
    // extremly low at the time of writing this.
    let keys = to.keys(obj)
    if (is.undefined(end)) {
      end = keys.length
    }

    if (i < end) {
      iterator.next = () => {
        if (i < end) {
          let key = keys[i]
          return { value: [ key, obj[key], i++ ] }
        }
        return done
      }
    } else {
      iterator.next = () => {
        if (i > end) {
          let key = keys[i]
          return { value: [ key, obj[key], i-- ] }
        }
        return done
      }
    }

    return iterator
  },

  /// @name object entries
  /// @description
  /// This function takes advatage of es6 object deconstructing abilities.
  /// It dramatically simplifies looping over objects, when you know the keys
  /// you're looping over.
  ///
  /// @arg {object} obj - The object you're looping over
  /// @arg {string} key_name ['key'] - The name of the current key in the object loop
  /// @arg {string} index_name ['i'] - The name of the current index in the loop
  ///
  /// @markup {js} **Example:**
  /// let example = {
  ///   foo: {
  ///     one: 'Item one',
  ///     two: 'Item two',
  ///     three: 'Item three'
  ///   }
  /// }
  ///
  /// for (let { key, one, two, three } of to.objectEntries(example)) {
  ///   // key -> 'foo'
  ///   // one -> 'Item one'
  ///   // two -> 'Item two'
  ///   // three -> 'Item three'
  /// }
  objectEntries(obj, key_name = 'key', index_name = 'i') {
    let i = 0
    let keys = to.keys(obj)
    let length = keys.length

    return {
      [Symbol.iterator]() {
        return this
      },
      next() {
        if (i < length) {
          let key = keys[i]
          i++
          return {
            value: {
              [key_name]: key,
              [index_name]: i - 1,
              ...obj[key]
            }
          }
        }

        return { done: true }
      }
    }
  },

  /// @name to.normalize
  /// @description
  /// Removes trailing/leading blank lines. Removes extra whitespace before all the lines that
  /// are passed without affecting the formatting of the passes string. Then removes
  /// all whitespace at the end of each line.
  /// @arg {string, array} content - The content you want to be normalized
  /// @arg {boolean} leading [true] - Determins if leading blank lines should be removed
  /// @arg {boolean} trailing [leading] - Determins if trailing blank lines should be removed. It defaults to `leading`.
  /// @arg {boolean} info [false]
  /// If this is set to true it will return an object of the information of what was removed
  /// along with the normalized string
  ///
  /// ```js
  /// {
  ///   content, // the updated string
  ///   leading, // the total leading lines that were removed
  ///   trailing, // the total trailing lines that were removed
  /// }
  /// ```
  ///
  /// @note {5} You can also pass in named arguments in the form of an object
  ///
  /// @markup Usage: All of these return the same result
  /// let content = `
  ///
  ///       foo
  ///       bar
  ///       baz
  ///
  /// ` // aka  "\n\n        foo\n        bar\n        baz\n\n"
  /// to.normalize(content)
  /// to.normalize(content.split('\n')) // aka [ '', '', '        foo', '        bar', '        baz', '', '' ]
  /// to.normalize({ content })
  /// // => "foo\nbar\nbaz"
  ///
  /// @markup Usage: passing options
  /// let content = `
  ///     Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  ///     Nemo cum, nostrum rem neque perspiciatis fugiat similique
  ///     unde adipisci officia, placeat suscipit explicabo non
  ///     consequuntur in numquam eaque laborum voluptas. Cumque?
  /// `
  /// let trailing = true
  /// let leading = trailing
  /// let info = false
  ///
  /// to.normalize(content)
  /// to.normalize({ content })
  /// to.normalize({ content }, trailing)
  /// to.normalize(content, trailing, leading, info)
  /// to.normalize(content, { trailing, leading, info })
  /// to.normalize({ content, trailing, leading, info })
  ///
  /// // all the `to.normalize` functions above result in the same thing
  /// // because these are the defaults
  ///
  /// // `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  /// // Nemo cum, nostrum rem neque perspiciatis fugiat similique
  /// // unde adipisci officia, placeat suscipit explicabo non
  /// // consequuntur in numquam eaque laborum voluptas. Cumque?`
  ///
  ///
  /// @markup Usage with info
  /// let content = `
  ///
  ///     Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  ///     Nemo cum, nostrum rem neque perspiciatis fugiat similique
  ///
  /// ` aka "\n\n    Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n    Nemo cum, nostrum rem neque perspiciatis fugiat similique\n\n"
  ///
  /// to.normalize(content, true, true, true)
  /// to.normalize(content, { info: true })
  /// to.normalize({ content, info: true })
  ///
  /// // {
  /// //   "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit.\nNemo cum, nostrum rem neque perspiciatis fugiat similique",
  /// //   "indent": 4,
  /// //   "leading": 2, // 2 leading blanks lines were remove
  /// //   "trailing": -2 // 2 trailing lines were removed
  /// // }
  ///
  /// @returns {string} - The normalized string
  normalize(...args) {
    const options = to.arguments({
      content: '',
      leading: true,
      trailing: undefined,
      info: false
    }, ...args)
    options.trailing = !is.undefined(options.trailing) ? options.trailing : options.leading

    let content = to.array(options.content) // this allows arrays and strings to be passed
    let leading = 0
    let trailing = 0

    if (options.leading) {
      while (content.length && !!!content[0].trim().length) {
        leading++
        content.shift()
      }
    }

    if (options.trailing) {
      while (content.length && !!!(content[content.length - 1].trim()).length) {
        trailing--
        content.pop()
      }
    }

    const indent = to.indentLevel(content)

    content = content
      .map((line) => line.slice(indent)) // remove extra whitespace from the beginning of each line
      .join('\n') // converts content to string
      .replace(/[^\S\r\n]+$/gm, '') // removes all trailing white spaces from each line

    if (!options.info) {
      return content
    }

    return { content, indent, leading, trailing }
  },

  indentLevel(str) {
    return to.string(str) // ensures argument is a string
    // gets the extra whitespace at the beginning of the line and
    // returns a map of the spaces
    .match(/^\s*/gm)
    // sorts the spaces array from smallest to largest and then checks
    // returns the length of the first item in the array
    .sort((a, b) => a.length - b.length)[0].length
  },

  arguments(defaults = {}, ...args) {
    let result = {} // placeholder for the result
    let keys = to.keys(defaults)

    for (let [ i, arg ] of to.entries(args)) {
      if (is.arguments(arg)) {
        arg = to.arguments(defaults, ...arraySlice(arg))
      }
      if (is.plainObject(arg)) {
        const initial = defaults[keys[i]]
        if (
          is.plainObject(initial) &&
          is.any.in(to.keys(initial), ...to.keys(arg))
        ) {
          result[keys[i]] = to.extend(to.clone(initial), arg)
        } else {
          to.extend(result, arg)
        }
      } else {
        result[keys[i] || i] = arg
      }
    }

    return to.extend(defaults, result)
  },

  /// @name to.extend
  /// @description
  /// Extend object `b` onto `a`
  /// http://jsperf.com/deep-extend-comparison
  /// @arg {object} a - Source object.
  /// @arg {object} b - Object to extend with.
  /// @returns {object} The extended object.
  extend(a, b) {
    // Don't touch `null` or `undefined` objects.
    if (!a || !b) {
      return a
    }

    for (let k in b) {
      if (b.hasOwnProperty(k)) {
        if (is.plainObject(b[k])) {
          a[k] = is.plainObject(a[k]) ? to.extend(a[k], b[k]) : b[k]
        } else {
          a[k] = b[k]
        }
      }
    }

    return a
  },

  /// @name to.clone
  /// @description
  /// This will clone argument so the passed arg doesn't change
  ///
  /// @arg {*} - The item you want to clone
  /// @returns {*} - The copied result
  clone,

  /// @name to.merge
  /// @description
  /// This is similar to `to.extend` except in `to.extend` the values
  /// in `a` are replaced with the values in `b`. This function will
  /// not only merge the objects together, it also merges the values of
  /// the objects together.
  ///
  /// If the value in `b` is a function **or** the value of `a` is undefined
  /// it will just set the value of `a` to be the value of `b`
  ///
  /// If the value in `a` is an array, then the value in `b` gets pushed
  /// onto the value in `a`.
  ///
  /// If the value in `a` is an object then it checks the value in `b` to
  /// see if it's an object and if it is then it calls `to.merge` again on
  /// those objects for recursion. If the value in `b` isn't an object then
  /// the value in `a` get's replaced by the value in `b`.
  ///
  /// If the value in `a` is anything else, then it converts it into an array
  /// and adds the value in `b` to it.(`[a[key], b[key]]`)
  ///
  /// @arg {object} - The object to be modified
  /// @arg {object} - The object that has the updates
  /// @arg {boolean} - If true every array will be flattend to a single dimensional array, and will remove duplicate values
  ///
  /// @markeup {js} **Example:**
  /// let a = { foo: { bar: "1", baz: ["3", "4"], qux: "one", quux: { garply: { waldo: "one" } }, waldo: "" } }
  /// let b = {
  ///   foo: {
  ///     bar: "2",
  ///     baz: ["5", "6"],
  ///     qux: ["two", "three"],
  ///     quux: { garply: { waldo: "two" } },
  ///     waldo: function(){ return this; },
  ///     garply: "item"
  ///   }
  /// }
  ///
  /// to.merge(a, b)
  ///
  /// @markup {js} **Output:**
  /// {
  ///  foo: {
  ///   bar: [ "1", "2" ], // started as a string and converted to an array
  ///   baz: [ "3", "4", "5", "6" ], // merged two arrays together
  ///   qux: [ "one", "two", "three" ], // started as a string and merged the array with the string
  ///   quux: { garply: { waldo: [ "one", "two" ] } }, // `foo.quux.garply.waldo` started as string and converted to an array
  ///   waldo: function(){ return this; }, // started as a string and changed to be a function
  ///   garply: "item" // didn't exist before so it stays as a string
  ///  }
  /// }
  merge(a, b, unique = true, flat = true) { // eslint-disable-line
    // a) Don't touch `null` or `undefined` objects.
    if (!a || !b) {
      return a
    }

    // loop over each key in the second map
    for (let k in b) {
      if (b.hasOwnProperty(k)) {
        // a) Set the value of `a` to be the value in `b` because it was either
        //    a function or it didn't exsit already in `a`
        // c) Push the value in `b` into the `a` values array
        // b) The recursive functionality happends here
        //    a) Call the merge function go further into the object
        //    b) Sets the value of `a` to be the value of `b`
        // d) Convert the a value to be an array, and add the `b` value to it
        if (is.fn(b[k]) || is.fn(a[k]) || is.undefined(a[k])) {
          a[k] = b[k]
        } else if (is.array(a[k])) {
          a[k].push(b[k])
        } else if (is.plainObject(a[k])) {
          a[k] = is.plainObject(b[k]) ? to.merge(a[k], b[k]) : b[k]
        } else {
          a[k] = [ a[k], b[k] ]
        }

        // a) is array
        if (is.array(a[k])) {
          // a) Flatten the array
          if (flat) {
            a[k] = to.flatten(a[k])
          }

          // a) Filter out duplicates
          if (unique && !is.plainObject(a[k][0])) {
            a[k] = to.unique(a[k])
          }
        }
      }
    }

    return a
  },

  /// @name to.object
  /// @description Converts a json object to a plain object
  /// @arg {json} - The json to parse
  /// @returns {object}
  object(arg) {
    if (is.array(arg)) {
      let result = {}
      for (let item of arg) result[item[0]] = item[1]
      return result
    }

    return JSON.parse(arg)
  },

  /// @name to.json
  /// @description Converts an object to a json string
  /// @arg {object} - The object to convert
  /// @arg {number} - The spacing to use
  /// @returns {json}
  json: (arg, spacing = 2) => (is.object(arg) || is.string(arg)) && JSON.stringify(arg, null, spacing),

  /// @name to.array
  /// @description
  /// Converts `...args` to array
  /// It converts multiple arrays into a single array
  /// @arg {array, string, object, number} - The item you want to be converted to array
  /// @returns {array}
  array(arg, glue = '\n') {
    if (is.array(arg)) {
      return arg
    } else if (is.arguments(arg)) {
      return arraySlice(arg)
    } else if (is.string(arg)) {
      arg = arg.split(glue)
      return arg.length === 1 && arg[0] === '' ? [] : arg
    } else if (is.plainObject(arg) || is.number(arg)) {
      return [ arg ]
    }

    return []
  },

  /// @name to.flatten
  /// @description
  /// Flattens an array, and arrays inside of it into a single array
  /// @arg {array}
  /// @returnes {array} - single dimensional
  // flatten(...args) {
  //   const flatten = (arg) => is.array(arg) ? arg.reduce((a, b) => a.concat(is.array(b) ? to.flatten(b) : b), []) : arg
  //   return args.map(flatten)
  // },
  flatten(...args) {
    let _flatten = (arg) => is.array(arg) ? [].concat(...arg.map(_flatten)) : arg
    return _flatten(args.map(_flatten))
  },

  /// @name to.unique
  /// @description
  /// Removes duplicate values from an array
  /// @arg {array}
  /// @returns {array} - without duplicates
  unique(arg) {
    if (!is.array(arg)) {
      return arg
    }

    let obj = {}
    let result = []
    /* eslint-disable guard-for-in */
    for (let i in arg) obj[arg[i]] = arg[i]

    for (let i in obj) result.push(obj[i])
    /* eslint-enable guard-for-in */

    return result
  },

  /// @name to.sort
  /// @description
  /// Sorts an array or object based off your callback function. If one is provided.
  /// @arg {array, object}
  /// @returns {array, object} - The sorted version
  sort(obj, callback) {
    if (is.array(obj)) {
      return obj.sort(callback)
    }

    let sorted = {}
    let keys = to.keys(obj).sort(callback)

    for (let i = 0, l = keys.length; i < l; i++) {
      sorted[keys[i]] = obj[keys[i]]
    }

    return sorted
  },

  /// @name to.map
  /// @description This function allows you to map an array or object
  /// @arg {array, object} obj
  /// @arg {function} callback
  /// @returns {array, object} that was mapped
  map(obj, callback, context = null) {
    if (is.array(obj)) {
      return obj.map(callback, context)
    }

    let result = {}

    for (let [ key, value, i ] of to.entries(obj)) {
      let cb_result = callback.call(context, { key, value }, i, obj)
      if (is.truthy(cb_result) && !is.empty(cb_result) && is.plainObject(cb_result)) {
        to.extend(result, cb_result)
      }
    }

    return result
  },


  /// @name to.map
  /// @description This function allows you to map an array or object
  /// @arg {array, object} obj
  /// @arg {function} callback
  /// @returns {array, object} that was mapped
  each(obj, callback, context = null) {
    if (is.array(obj)) {
      for (let [ i, value ] of to.entries(obj)) {
        callback.call(context, value, i, obj)
      }
      return
    }

    for (let [ key, value, i ] of to.entries(obj)) {
      callback.call(context, { key, value }, i, obj)
    }
  },

  /// @name to.reduce
  /// @description This function allows you to reduce an array or object
  /// @arg {array, object} obj
  /// @arg {function} callback
  /// @returns {*} What ever the object or array was reduced to
  reduce(obj, callback, initial) {
    if (is.array(obj)) {
      return obj.reduce(callback, initial)
    }

    for (let [ key, value, i ] of to.entries(obj)) {
      initial = callback(initial, { key, value }, i, obj)
    }

    return initial
  },

  /// @name to.filter
  /// @description This function allows you to filter an array or object
  /// @arg {array, object} obj
  /// @arg {function} callback [Boolean]
  /// @returns {array, object} that was filtered
  filter(obj, callback = Boolean, context = null) {
    if (is.array(obj)) {
      return obj.filter(callback, context)
    }

    let result = {}

    for (let [ key, value, i ] of to.entries(obj)) {
      if (is.truthy(callback.call(context, { key, value }, i, obj))) {
        to.extend(result, { [key]: value })
      }
    }

    return result
  },

  /// @name to.number
  /// @description
  /// Converts `arg` to number
  /// @arg {number, array, object, string, boolean}
  /// @returns {number}
  number(arg) {
    if (is.number(arg)) {
      return arg
    } else if (is.array(arg)) {
      return arg.length
    } else if (is.plainObject(arg)) {
      return to.keys(arg).length
    }

    return ~~arg // eslint-disable-line
  },

  /// @name to.regex
  /// @description
  /// This function will convert a string or array into a regex expression
  /// @arg {string, array}
  /// @returns {Regex}
  regex(...args/* , flags */) {
    let flags = args.pop()
    const length = flags.length
    const test = flags.match(/[gimy]+/)
    if (is.any.falsy(is.between(length, 1, 3), test && test.length === length)) {
      args.push(flags)
      flags = ''
    }

    return new RegExp(to.flatten(...args).join(''), flags)
  }
}

export default to
