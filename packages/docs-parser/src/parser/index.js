import { fs, is, to, Logger } from '../utils'
import AnnotationApi from '../annotation-api'
import path from 'path'
import Tokenizer from './tokenizer'

export default class Parser {
  constructor(options) { // eslint-disable-line
    this.setOptions(arguments)
  }

  setOptions(options) {
    options = to.arguments({
      language: {
        prefix: '@',

        // header comment style
        // @note {10} only 1 of these can be used per file
        header: { start: '////', line: '///', end: '////', type: 'header' },

        // body comment style
        body: { start: '', line: '///', end: '', type: 'body' },

        // inline comment style
        inline: { start: '', line: '///#', end: '', type: 'inline' },

        // this is used for any interpolations that might occur in annotations.
        // I don't see this needing to change but just incase I'm making it a setting.
        // @note {10} This setting is used to create a RegExp so certain characters need to be escaped
        interpolation: { start: '\\${', end: '}' },
      },
      type: undefined,
      blank_lines: 4,
      indent: true,
      annotations: {},
      sort: (a, b) => a.localeCompare(b), // same as the default sort function
      log: new Logger()
    }, arguments)

    let { annotations, type, log, ...rest } = options
    this.log = log
    this.options = rest
    this.api = new AnnotationApi({ annotations, type })

    // this is used to pass to the annotations when they're called
    this.annotation_options = { log: this.log, options: this.options }

    const { language } = this.options

    this.comment_values = to.flatten([
      ...to.values(language.header, '!type'),
      ...to.values(language.body, '!type'),
      ...to.values(language.inline, '!type')
    ])
    this.comment_values = to.unique(this.comment_values).filter(Boolean)

    {
      let { alias, parse } = this.api.annotations
      parse = to.keys(parse)
      const reverse_alias_list = to.reduce(alias, (previous, { key, value }) => {
        value = value
          .filter((_alias) => !is.in(parse, _alias))
          .reduce((a, b) => to.extend(a, { [b]: key }), {})
        return to.extend(previous, value)
      }, {})
      const regex = new RegExp(`^\s*${language.prefix}(?:(${to.keys(reverse_alias_list).join('|')})|(${parse.join('|')}))\\b\\s*`)

      this.annotations_list = { reverse_alias_list, regex }
    }
  }

  async parse(file = {}) {
    file = is.plainObject(file) ? file : { path: file }
    file.type = file.type || path.extname(file.path).replace('.', '')
    file.contents = file.contents || to.string(await fs.readFile(file.path))
    file.name = path.basename(file.path, `.${file.type}`) // name of the file
    file.start = 1 // starting point of the file
    file.end = to.array(file.contents).length // ending point of the file
    // add the file to the annotation_options that are passed to the annotation functions
    this.annotation_options.file = this.file = file

    // if the file is empty or there aren't any comments then
    // just return the the empty values
    if (
      is.empty(file.contents) ||
      !is.any.in(file.contents, ...(this.comment_values))
    ) {
      return { header: {}, body: [] }
    }

    let tokens = this.getTokens(file.contents)
    tokens = this.getAnnotations(tokens)
    tokens = this.parseTokens(tokens)
    tokens = this.autofillTokens(tokens)
    tokens = this.resolveTokens(tokens)
    tokens = this.cleanupTokens(tokens)
    return tokens
  }

  getTokens(contents = '') {
    const { language, blank_lines, indent } = this.options
    const base = { blank_lines, indent, verbose: true }
    const header = new Tokenizer(contents, 0, language.header, { restrict: true, ...base })[0] || {}

    // remove the code from the header comment because it shouldn't be used.
    if (header.code) {
      header.code = { contents: [], start: -1, end: -1 }
    }

    let body = new Tokenizer(contents, header.comment ? header.comment.end + 1 : 0, language.body, base)
    const inline_tokenizer = new Tokenizer({ comment: language.inline, ...base })

    body = body.map((token) => {
      let { start: offset } = token.code
      offset -= 1
      token.inline = inline_tokenizer.parse(token.code.contents, { offset })
      return token
    })

    return { header, body }
  }

  map({ header, body }, callback) {
    const map = (token, index, parent = false) => {
      if (is.empty(token)) return {}
      if (parent.inline) {
        delete parent.inline
      }
      token = callback(token, parent)

      if (token.inline && !is.empty(token.inline)) {
        token.inline = to.map(token.inline, (obj, i) => map(obj, i, token))
      }

      return token
    }

    header = map(header)
    body = to.map(body, (token, i) => map(token, i, header))
    return { header, body }
  }

  getAnnotations({ header, body }) {
    const { language } = this.options
    const { reverse_alias_list, regex } = this.annotations_list
    const hasAnnotation = (line) => {
      line.has_annotation = false // by default each line doesn't have a annotation
      // remove the annotation from the line
      line.str = `${line}`.replace(regex, (match, alias, annotation) => {
        if (alias) {
          // find the correct annotation to use if an alias is found
          annotation = reverse_alias_list[alias]
        }
        line.raw_without_comment = line.str // save the origial string with the annotation just in case it needs to be used later
        line.annotation = annotation || '' // if an annotation was found then set the name of the annotation
        line.raw_annotation = !!annotation ? `${language.prefix}${annotation}` : '' // set the raw annotation with the prefix
        line.alias = alias || '' // if an alias was used the save it
        line.has_annotation = true
        return ''
      })

      return line
    }

    return this.map({ header, body }, (token) => {
      let { comment, code, inline } = token

      // find lines that have annotations and set the correct annotation if an alias is found
      comment.contents = to.map(comment.contents, hasAnnotation)

      // get the annotations that are in the comment
      const annotations = new Annotations(comment.contents, language.prefix)

      return { comment, code, inline, annotations }
    })
  }

  parseTokens(tokens) {
    return this.map(tokens, (token, parent) => {
      token.parsed = to.reduce(token.annotations, (result, annotation) => {
        const current = this.api.run('parse', {
          annotation,
          ...token,
          parent,
          ...(this.annotation_options)
        })

        if (result != null) {
          return to.merge(result, {
            [annotation.name]: current
          })
        }
      }, {})

      return token
    })
  }

  autofillTokens(tokens) {
    const autofill_list = to.keys(this.api.annotations.autofill)
    return this.map(tokens, (token, parent) => {
      const parsed_keys = to.keys(token.parsed)
      for (let name of autofill_list) {
        if (!is.in(parsed_keys, name)) {
          const result = this.api.run('autofill', {
            annotation: { name },
            ...token,
            parent,
            ...(this.annotation_options)
          })
          if (result != null) {
            token.parsed[name] = result
          }
        }
      }

      return token
    })
  }

  resolveTokens(tokens) {
    const { sort } = this.options
    let resolve_list = to.keys(this.api.annotations.resolve)
    // sort the parsed object before the annotations are resolved
    if (is.fn(sort)) {
      resolve_list = to.sort(resolve_list, sort)
    }

    return this.map(tokens, (token, parent) => {
      const parsed_keys = to.keys(token.parsed)
      for (let name of resolve_list) {
        if (is.in(parsed_keys, name)) {
          const result = this.api.run('resolve', {
            annotation: { name, alias: this.api.annotations.alias[name] },
            ...token,
            parent,
            ...(this.annotation_options)
          })
          if (result != null) {
            token.parsed[name] = result
          }
        }
      }
      return token
    })
  }

  cleanupTokens(tokens) {
    // option a
    // return
    return this.map(tokens, ({ parsed, inline }) => {
      return to.object(to.json({ ...parsed, inline }))
    })

    // option b
    let { header, body } = tokens
    let autofill_keys = to.keys(this.api.annotations.autofill)
    const cleanup = ({ inline, parsed }) => {
      if (!parsed) return {}
      parsed = to.object(to.json(parsed)) // this get's rid of any weird objects that might still be present
      if (inline) {
        return to.merge(parsed, to.reduce(inline, (prev, next) => {
          return to.merge(prev, to.filter(next.parsed, ({ key }) => {
            return !is.in(autofill_keys, key)
          }))
        }, {}))
      }
      return parsed
    }

    header = cleanup(header)
    body = to.map(body, cleanup)

    return { header, body }
  }
}


class Annotations {
  constructor(lines) {
    this.annotations = []
    this.stash = lines
    this.iterator = to.entries(this.stash)
    this.index = 0
    this.getAnnotations()
    return this.annotations
  }

  peak(amount = 1) {
    return this.stash[this.index + amount]
  }

  next() {
    const obj = this.iterator.next().value
    if (!obj) return false
    this.index = obj[0]
    this.line = obj[1]
    return true
  }

  hasNext() {
    return !!this.peak()
  }

  getAnnotations() {
    this.next()
    this.annotation = new Annotation(this.line)

    if (this.hasNext() && !this.peak().has_annotation) {
      this.next()
      this.getContent()
    }

    this.pushAnnotation()
    this.annotation = undefined

    if (this.hasNext()) {
      return this.getAnnotations()
    }

    return this.annotations
  }

  pushAnnotation() {
    let { contents, start, end, ...rest } = this.annotation

    // this ensures that the line of the annotation always stays intact
    // even if it's empty
    let line = contents.shift()
    line.str = `${line}`.trim()

    let { content, leading, trailing } = to.normalize(contents.join('\n'), { info: true })

    trailing += contents.length
    content = to.array(content)
    if (is.empty(content)) {
      contents = []
    } else {
      contents = contents
        .filter((a, i) => i >= leading && i < trailing) // filter out the lines that were removed
        .map((_line, i) => {
          _line.str = content[i] // update the lines content to be the normalized version
          return _line
        })
    }

    // prepend the line back onto the contents
    contents.unshift(line)

    start = (contents[0] || {}).lineno || start || -1 // get the starting line of the comment
    end = (contents.slice(-1)[0] || {}).lineno || end || start || -1 // get the end line of the comment

    this.annotations.push({ contents, start, end, ...rest })
  }

  getContent() {
    this.annotation.contents.push(this.line)
    if (this.hasNext() && !this.peak().has_annotation) {
      this.next()
      return this.getContent()
    }
  }
}

class Annotation {
  constructor(line) {
    const { annotation: name, alias, lineno: start } = line
    return {
      name, // sets the current annotation name
      alias,
      contents: [ line ],
      start,
      end: 0
    }
  }
}
