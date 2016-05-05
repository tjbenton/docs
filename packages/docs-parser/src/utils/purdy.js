// Load modules
import to from './to'
import clor from 'clor'

export default class Purdy {
  constructor(options = {}) {
    this.config = {
      plain: false,
      path: false,
      indent: 2,
      align: 'left',
      arrayIndex: true,
      path_prefix: '// ',
      colors: {
        BoolFalse: 'red.bold',
        BoolTrue: 'green.bold',
        Circular: 'grey.bold.inverse',
        Date: 'yellow',
        error: 'red',
        Function: 'cyan',
        Key: 'white.bold',
        Null: 'red.bold',
        Number: 'blue.bold',
        RegExp: 'magenta',
        String: 'green', // use the default color
        Undefined: 'red.inverse',
        path: 'grey'
      }
    }

    to.extend(this.config, options)

    this.indent_level = 0
    this.seen = []
    this.path = []

    return this
  }

  print(...args) {
    return console.log(...this.format(...args))
  }

  log(...args) {
    return this.print(...args)
  }

  format(...args) {
    this.seen = []
    this.path = []
    return args.map((arg) => {
      this.indent_level = 0
      return this.travel(arg)
    })
  }

  travel(object, path = '') {
    let type = global.toString.call(object).split(' ')[1].slice(0, -1)
    return this.colorize((this[`_${type.toLowerCase()}`] || String).call(this, object, path), type)
  }

  colorize(string, type) {
    if (this.config.plain) {
      return string
    }

    let colors = this.config.colors[type]

    if (!colors) {
      return string
    }

    colors = colors.split('.')

    for (let color of colors) {
      string = clor[color](string)
    }

    return string
  }

  length_compare(a, b) {
    return a.length - b.length
  }

  tidy_path(path) {
    return this.colorize(path.slice(1, path.size), 'path')
  }

  print_member(member, max) {
    if (this.config.align === 'left') {
      max = 0
    }

    return this.colorize(this.spaces(max.length - member.length) + member, 'Key')
  }

  indent() {
    return this.spaces(this.indent_level * this.config.indent)
  }

  spaces(count) {
    let out = ''
    while (count--) out += ' '
    return out
  }

  show_circular(index) {
    let show_path = this.path[index]
    show_path = show_path === '' ? '' : ` ${show_path.slice(1, show_path.length)}`
    return this.colorize(`[Circular~${show_path}]`, 'Circular')
  }


  _object(object, path) {
    if (to.keys(object).length === 0) {
      return '{}'
    }

    const index = this.seen.indexOf(object)

    if (index !== -1) {
      return this.show_circular(index)
    }

    this.seen.push(object)
    this.path.push(path)

    const keys = to.keys(object)
    let key_lengths = to.clone(keys)

    this.indent_level += 1

    let out = '{\n'

    for (let i = 0, l = keys.length; i < l; ++i) {
      let key = keys[i]
      let item = object[key]

      if (this.config.path && path.length > 0) {
        key_lengths.push(this.config.path_prefix)
        out += this.indent() +
               this.colorize(this.config.path_prefix, 'path') +
               this.tidy_path(path + '.' + key) +
               '\n'
      }

      let longest = key_lengths.sort(this.length_compare)[key_lengths.length - 1]
      let key_str = key.toString()

      out += this.indent() +
             this.print_member(key_str, longest) +
             ': ' +
             this.travel(item, `${path}.${key_str}`)

      if (i !== l - 1) {
        out += ','
      }

      out += '\n'
    }

    this.indent_level -= 1

    out += this.indent() + '}'

    return out
  }

  _array(array, path) {
    if (array.length === 0) {
      return '[]'
    }

    let index = this.seen.indexOf(array)

    if (index !== -1) {
      return this.show_circular(index)
    }

    this.seen.push(array)
    this.path.push(path)

    let out = '[\n'

    this.indent_level += 1

    for (let i = 0, l = array.length; i < l; ++i) {
      let item = array[i]

      if (this.config.path && path.length > 0) {
        out += this.indent() +
               this.colorize(this.config.path_prefix, 'path') +
               this.tidy_path(path + '.' + i) +
               '\n'
      }

      let index_str = this.config.arrayIndex ? `[${this.print_member(i, l)}] ` : ''

      out += this.indent() + '' + index_str + this.travel(item, `${path}.${i}`)

      if (i !== l - 1) {
        out += ','
      }

      out += '\n'
    }

    this.indent_level -= 1
    out += this.indent() + ']'
    return out
  }

  _error(err) {
    if (Object.keys(err).length === 0) {
      return this.colorize(`[${err}]`, 'error')
    }
    return this.types.Object(err)
      .replace(/^{/, '{ ' + this.colorize(`[Error: ${err.message}]`, 'error'))
  }

  _string(str) {
    // str = to.normalize(str, false).split('\n')
    str = to.array(str)
    let quote = str.length > 1 ? '`' : "'"
    let l = str.length

    // returns because it's a single line string
    if (l <= 1) {
      return quote + to.string(str) + quote
    }

    // let has_newline_only = /(?:\s*?(\n)\s*?)(.*)/.exec(str[0])

    str.splice(0, 1, quote + str[0])
    str.splice(l - 1, l, str[l - 1] + quote)

    // removes the first line from the str so it doesn't get indented
    let out = str.splice(0, 1)

    for (let line of str) {
      out.push(this.indent() + this.colorize(line, 'string'))
    }

    return out.join('\n')
  }

  _boolean(bool) {
    if (bool === true) {
      return this.colorize(bool + '', 'BoolTrue')
    }

    return this.colorize(bool + '', 'BoolFalse')
  }

  _function(func) {
    if (func.name) {
      return this.colorize(`[Function: ${func.name}]`, 'Function')
    }

    return this.colorize('[Function: ?]', 'Function')
  }
}
