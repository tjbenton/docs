import Purdy from './purdy'
import clor from 'clor'
import to from 'to-js'

let icon = {
  chevron: '\xBB ',
  check: '\u2713 ',
  warning: '\u26A0 ',
  error: '\u2326 '
}

const messaging = {
  warning: clor.yellow.bold(`${icon.warning}[WARNING]`),
  debug: clor.magenta.bold(`${icon.chevron}[DEBUG]`),
  error: clor.red.bold(`${icon.error}[ERROR]`),
  file: clor.bgBlue.white(`${icon.chevron}[FILE]`)
}

const purdy = new Purdy()

class Logger {
  constructor(options = {}) {
    this.events = []
    this.times = {}
    this.options = to.extend({
      debug: true,
      warning: true,
      timestamps: true,
      report: true
    }, options)

    if (this.options.report) {
      this.report()
    }
  }

  /// @description
  /// Observe an event.
  /// @arg {string} name of event to observe
  /// @arg {function} handler
  on(name, cb) {
    (this.events[name] = this.events[name] || []).push(cb)
    return this
  }

  /// @description Emit an event to observers.
  /// @arg {string} name of event to emit
  /// @arg {object} data to send
  emit(name, ...args) {
    (this.events[name] || []).forEach((event) => event.call(this, ...args))
    return this
  }

  log(...args) {
    console.log(...this.format(...args))
    return this
  }

  print(...args) {
    return this.log(...args)
  }

  format(...args) {
    return to.map(args, (arg) => {
      switch (to.type(arg)) {
        case 'array':
        case 'object':
        case 'number':
          return purdy.format(arg).toString()
        case 'function':
          let obj = to.array(arg.toString())
          const first = obj.shift()
          return first + '\n' + to.normalize(obj)
        case 'string':
          return to.normalize(arg)
        default:
          return arg
      }
    })
  }

  space() {
    console.log('')
  }

  report() {
    this
      .on('start', (name) => this.options.timestamps && this.time(name))
      .on('complete', (name, format = '%s finished after %dms') => this.options.timestamps && this.timeEnd(name, format))

    this
      .on('debug', (...args) => {
        if (this.options.debug) {
          console.log('')
          this.log(`${messaging.debug}`)
          this.log(...args)
        }
      })
      .on('file', (file, ...args) => {
        if (this.options.debug) {
          console.log('')
          this.log(`${messaging.file} ${file}`)
          this.log(...args)
        }
      })


    this.on('warning', (...args) => {
      if (this.options.warning) {
        console.log('')
        this.log(`${messaging.warning}`)
        this.log(...args)
      }
    })

    this.on('error', (...args) => {
      console.log('')
      this.log(`${messaging.error}`)
      this.log(...args)
    })


    this.on('success', (...args) => {
      this.log(`${clor.green(icon.check)}`, ...args)
    })
  }

  warning(...args) {
    this.emit('warning', ...args)
    return this
  }

  error(...args) {
    this.emit('error', ...args)
    return this
  }

  time(label) {
    this.times[label] = Date.now()
    return this
  }

  timeEnd(label, format = '%s completed after %dms') {
    let time = this.times[label]

    if (!time) {
      throw new Error(`No such label: ${label}`)
    }

    let duration = Date.now() - time
    console.log(
      `${clor.green(icon.check)}${format}`,
      label,
      duration
    )
    return this
  }

  debug(...args) {
    this.emit('debug', ...args)
    return this
  }

  success(...args) {
    this.emit('success', ...args)
    return this
  }

  file(file, ...args) {
    this.emit('file', ...args)
    return this
  }
}


let defaultLogger
defaultLogger = global.docsLogger = global.docsLogger || new Logger()

defaultLogger.Logger = Logger
export default defaultLogger
