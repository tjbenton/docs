import { is, to, Logger } from './'
import clor from 'clor'

/// @name debug
/// @description
/// This is a ES7/ES2016 decorator function. It adds helpful debugging capabilities
/// to any class with the option to turn it off an on with ease
///
/// @arg {boolean} value [false] determins if you want to debug your function
///
/// @markup Basic Setup
/// @debug()
/// class MyClass {}
///
/// @markup Debugging information
/// class MyClass {
///   constructor(str) {
///     this.lines = str.split('\n')
///     ...
///     return this.parse()
///   }
///   parse() {
///     for ( let [ lineno, line] of this.lines.entries()) {
///       this.debug('lineno', lineno)
///       this.debug('line', line)
///       this.debug('other useful information')
///
///       this.runDebug()
///     }
///   }
/// }
///
/// const test = new MyClass(
/// `
/// var foo = 'bar'
/// var bar = 'bar'
/// `
/// )
///
/// @markup Yields
/// [user:~/path/to/project]$
///
///
/// » [DEBUG]
/// lineno: 0
/// line:
///
///
/// » [DEBUG]
/// lineno: 1
/// line: var foo = 'bar'
///
///
/// » [DEBUG]
/// lineno: 2
/// line: var bar = 'bar'
///
///
/// » [DEBUG]
/// lineno: 3
/// line:
///
/// @markup Multiple debuggers
/// class MyClass {
///   ...
///   parse() {
///     const parseDebug = this.debugSet()
///     for ( let [ lineno, line] of this.lines.entries()) {
///       parseDebug.debug('lineno', lineno)
///       parseDebug.debug('line', line)
///       parseDebug.debug('other useful information')
///
///       parseDebug.runDebug()
///     }
///   }
/// }
///
export default function debug(default_name = 'DEBUG', default_should_debug = false, default_options = {}) {
  try {
    let color_list = [ 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'gray' ]

    default_options = to.extend({
      spaces: 2,
      seperator: ' > ',
      color: to.random(color_list)
    }, default_options)

    color_list = color_list.filter((color_name) => color_name !== default_options.color)

    const log = new Logger()

    const icon_chevron = '\xBB '

    default_name = clor[default_options.color].bold(`${icon_chevron}[${default_name}]: `)


    function Debugger(name = 'Define a Name', should_debug = default_should_debug, options = {}) {
      if (is.plainObject(should_debug)) {
        options = should_debug
        should_debug = options.should_debug || options.condition || default_should_debug
      }
      this.should_debug = should_debug
      this.debug_list = []
      this.name = name
      this.color = options.color
      this.spaces = options.spaces
    }

    const dp = Debugger.prototype

    dp.push = dp.debug = dp.add = function push(...args) {
      this.debug_list.push(...args)
      return this
    }

    dp.always = function always(arg, ...args) {
      this.debug_list.push(...args)
      return arg
    }

    dp.shouldRun = function shouldRun(...args) {
      let should_run = false
      let last = args.slice(-1)[0]
      if (is.boolean(last)) {
        should_run = last
        args.pop()
      }
      this.debug_list.push(...args)
      if (should_run) {
        this.run()
      }
      return args
    }

    dp.debugIfElse = dp.ifElse = dp.ife = dp.if = function debugIfElse(arg, if_true, if_false) {
      if (is.truthy(arg) && !is.undefined(if_true)) {
        this.debug_list.push(if_true)
      } else if (!is.undefined(if_false)) {
        this.debug_list.push(if_false)
      }
      return arg
    }

    dp.debugIfTrue = dp.ifTrue = function debugIfTrue(arg, ...args) {
      if (is.truthy(arg)) {
        this.shouldRun(...args)
      }

      return arg
    }


    dp.debugIfFalse = dp.ifFalse = function debugIfFalse(arg, ...args) {
      if (arg === false) {
        this.shouldRun(...args)
      }

      return arg
    }

    dp.debugWrap = dp.wrap = function debugWrap(arg, cb, ...args) {
      if (is.undefined(cb)) {
        cb = () => true
      }
      if (cb(arg)) {
        this.shouldRun(...args)
      }

      return arg
    }

    dp.debugSet = dp.set = function debugSet(name = 'define a name silly', should_debug, options = {}) {
      if (is.plainObject(should_debug)) {
        options = should_debug
        should_debug = undefined
      } if (is.number(should_debug)) {
        options.spaces = should_debug
        should_debug = undefined
      } else if (is.string(should_debug)) {
        options.color = should_debug
        should_debug = undefined
      }

      // if should_debug is not defined then it will inherit the value that
      // was set on the original debugSet or its parent
      if (is.undefined(should_debug)) {
        should_debug = !is.undefined(this.should_debug) ? this.should_debug : default_should_debug
      }

      if (
        options.color === 'inherit' || (
          this.color === 'inherit' &&
          is.undefined(options.color)
        )
      ) {
        options.color = this.color ? this.color : default_options.color
      }

      options = to.extend({
        // if the parent debugSet exsists then use it's defined spaces,
        // else use the default spaces
        spaces: this.spaces ? this.spaces : default_options.spaces,
        seperator: this.seperator ? this.seperator : default_options.seperator,
        color: to.random(color_list)
      }, options)

      // colorize the name
      name = clor[options.color].bold(name)

      // if a name exists then prepend it to the name that was passed
      name = this.name ? this.name + options.seperator + name : default_name + name

      return new Debugger(`${name}`, should_debug, options)
    }

    /* eslint-disable */
    dp.runDebug = dp.run = function runDebug() {
      try {
        if (this.should_debug) {
          for (let i = this.spaces; i; i--) console.log('')
          console.log(this.name)
          if (this.debug_list.length > 0) {
            this.debug_list.slice(0, 1).forEach((obj) => log.print(obj))
            this.debug_list.slice(1).forEach((obj) => log.print(obj))
          }
          // update the debug list to be empty
          this.debug_list = []
        }
      } catch (e) {
        console.trace(e)
      }
    }
    /* eslint-enable */

    for (let fn in dp) {
      if (fn !== 'run' || fn !== 'runDebug') {
        dp[fn].run = dp[fn].runDebug = dp.runDebug
      }
    }

    // for (let fn_to_set in dp) {
    //   for (let fn in dp) {
    //     if (fn_to_set !== 'run' || fn_to_set !== 'runDebug') {
    //       dp[fn_to_set][fn] = dp[fn_to_set].prototype[fn] = dp[fn]
    //     }
    //   }
    // }

    return function debugDecorator(target) {
      target.prototype.debugSet = Debugger.prototype.debugSet
      return target
    }
  } catch (err) {
    console.trace(err)
  }
}
