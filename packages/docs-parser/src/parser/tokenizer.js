/* eslint-disable complexity, max-statements, max-depth */
import { is, to, debug as _debug } from '../utils'
import { default_options } from '../config'
import clor from 'clor'

/* eslint-enable */
@_debug('Tokenizer')
export default class Tokenizer {
  constructor(str, options = {}) { // eslint-disable-line
    this.options = {}
    this.setOptions(arguments)

    if (!is.empty(this.stash)) {
      return this.parse()
    }
    return
  }

  setOptions(options) { // eslint-disable-line
    const debug = this.debugSet('options')
    options = to.arguments({
      content: '',
      lineno: 0,
      comment: this.options.comment || { start: '', line: '///', end: '', type: undefined }, // the default comment style to look for
      blank_lines: this.options.blank_lines || default_options.blank_lines,
      // determins if all the extra line info will be returned or if it will just return strings
      verbose: !is.undefined(this.options.verbose) ? this.options.verbose : false,
      // determins if the comment should be stripped from the line
      strip: !is.undefined(this.options.strip) ? this.options.strip : false,
      // if true this option will only return the first token
      restrict: !is.undefined(this.options.restrict) ? this.options.restrict : false,
      // determins if the code below should stop parsing if the indent level is less than the starting indent level
      indent: !is.undefined(this.options.indent) ? this.options.indent : true,
      offset: 0,
    }, arguments)


    debug.push('options 1:', options)

    { // parse the comment to ensure the settings are valid, and attempt to update them
      // to be valid if they aren't valid
      let { start, line, single, end, type } = options.comment

      single = single || line
      // this ensures there aren't any errors while looking comment lines
      // because `''` will always have an index of `0`
      if (single === '') {
        single = undefined
      }

      if (is.any.in([ single, '' ], start, end)) {
        start = end = undefined
      }

      if (!single && is.any.undefined(start, end)) {
        throw new Error("You must set the start and end comment style if you don't specify a single comment")
      } else if (!start && !end && !single) {
        throw new Error('You must set the single comment or the start and end comment')
      } else if (is.all.existy(single, start, end) && (start.length <= single.length || start.end <= single.length)) {
        throw new Error('The start and end comments must be longer than the single comment')
      }

      options.comment = { start, single, end, type }
      this.is_multi = is.all.truthy(start, end)
      this.is_same_multi = this.is_multi && start === end
    }

    { // set the lineno to start with
      const { i, index, lineno, start_at, ...rest } = options
      this.lineno = i || index || start_at || lineno || 0
      options = rest
    }


    let stash
    { // set the string to use
      let { str, string, source, code, content, contents, ...rest } = options
      stash = str || string || source || code || content || contents || ''
      options = rest
    }

    // update the options
    this.options = options

    // holds the parsed tokens
    this.tokens = []

    this.current_blank_lines = 0

    // update the stash
    this.stash = this.getStash(stash)

    // update the iterator to use
    this.iterator = to.entries(this.stash, this.lineno)

    debug.push('this.options', this.options, '')
    debug.run()
  }

  /// @name hasNext
  /// @description
  /// Used to check if the next line exists
  /// @returns {boolean}
  hasNext() {
    return this.debugHasNext.ifFalse(this.peak(), "doesn't have another element", true)
  }

  /// @name next
  /// @description
  /// Used to progress forward to the next line
  /// @returns {boolean} - If true it means the next line exists, else the next line doesn't exisit
  next() {
    const obj = this.iterator.next().value
    if (!obj) return false
    this.line = obj[1]
    this.lineno = obj[0]
    return true
  }

  /// @name peak
  /// @description
  /// This function is used to peak ahead or behind the current line
  /// @arg {number} amount [1] - The amount to look ahead or before
  /// @returns {object} - The line
  peak(amount = 1) {
    return this.stash[this.lineno + amount]
  }

  /// @name stash
  /// @description
  /// This updates the stash that's used for this parser
  /// @arg {string} str [''] - The string to use for the stash
  /// @returns {array} - The array of lines with the correct info
  getStash(content = '') {
    // add a starting line to the content to convert it to be 1 based instead of 0 based
    // fixes stupid ass issues with windows
    content = '\n' + to.normalString(content)

    // if the content is empty return an empty string
    if (this.isEmpty(content)) return []

    // add a space to each line so the line index is 1 based instead of 0 based. If the line is empty,
    // a space will not be added so that it's still easy to check if a line is empty or not. Doing this makes it
    // much easier to determine if any of the indexes are actually falsy or not, and it makes tracking errors easier
    return to.map(to.array(content), (line, i) => {
      line = new Line(!line ? line : ` ${line}`, i)
      const str = `${line}`
      line.index = to.reduce([ 'start', 'single', 'end' ], (prev, next) => {
        prev[next] = this.commentExists(str, this.options.comment[next])
        return prev
      }, {})

      // This ensures that `line` can't be true if there's already a `start` or `end` style comment
      if (this.is_multi && (line.index.start || line.index.end)) {
        line.index.single = false
      }


      {
        const { start, single, end } = this.options.comment
        let code_exsists
        // remove the comment and check to see if it has a line has code on it.
        if (this.isEmpty(str)) {
          code_exsists = true
        } else if (!this.is_multi && line.index.single) {
          code_exsists = !this.isEmpty(this.getBefore(single, str))
        } else if (this.is_same_multi || line.index.start) {
          code_exsists = !this.isEmpty(this.getBefore(start || end, str))
        } else {
          code_exsists = !this.isEmpty(this.getAfter(end, str))
        }

        line.index.code = code_exsists && line.indent
      }

      line.has_comment = is.any.truthy(line.index.start, line.index.single, line.index.end)
      line.has_code = is.truthy(this.isEmpty(str) || line.index.code)

      return line
    })
  }

  /// @name parse
  /// @description
  /// This will parse the passed content
  /// @arg {string} content [''] - The content to parse
  /// @arg {number} start_at [0] - The starting line to start parsing at
  /// @arg {boolean} verbose [this.verbose] - The default is what was passed when creating the Tokenizer
  /// @returns {array} - Of parsed tokens
  /// @note {5} This function also accepts a object to be passed with named arguments
  /// @markup Usage
  parse(content = '', start_at = 0) { // eslint-disable-line
    if (is.empty(this.stash)) {
      this.setOptions(arguments)
    }

    this.setDebug()
    const debug = this.debugParse
    const result = to.clone(this.getTokens())
    this.tokens = [] // reset the tokens list to be empty
    this.stash = [] // resets the stash to be empty
    this.token = undefined // reset the current token to be empty
    debug.push('parsed:', result).run()
    return result
  }

  /// @name isEmpty
  /// @description checks to see if the passed string is empty(only contains spaces)
  /// @returns {boolean}
  isEmpty(str) {
    return !str.replace(/\s+/gm, '')
  }

  /// @name getTokens
  /// @description
  /// This function will recursively get all the tokens in the file
  getTokens() {
    this.token = undefined
    this.setDebug(true)
    const debug = this.debugGetTokens
    if (!this.hasNext()) {
      return this.tokens
    }

    this.next()

    if (
      debug.ifTrue(is.empty(`${this.line}`.trim()), "the line was empty, and isn't in a token already") ||
      debug.ifTrue(!this.line.has_comment, "The line doesn't have a comment, and isn't in a token already") ||
      debug.ifTrue(this.is_multi && !this.line.index.start, "The line doesn't have a starting comment")
    ) {
      debug.push('', '', '', '').run()
      return this.getTokens()
    }

    debug.push(`line [${this.lineno}]: ${clor.bgBlue(this.line)}`, this.line).run()

    if (this.line.has_comment) {
      this.token = new Token()

      if (this.options.comment.type) {
        this.token.comment.type = this.options.comment.type
      }

      debug.push('has comment').run()

      if (this.is_same_multi && this.line.index.start === this.line.index.end) {
        this.line.index.end = false
      }

      if (!this.is_multi) {
        this.getSingleComment()
      } else {
        this.getMultiComment()
      }
    }

    if (this.line.has_code) {
      this.getCode()
    }

    if (is.truthy(this.token)) {
      this.pushToken()
    }

    debug.push('', '', '', '').run()

    return !this.options.restrict ? this.getTokens() : this.tokens
  }

  /// @name this.getBefore
  /// @description
  /// This function is used to get the content before a comment
  /// @arg {string} comment - the comment to start after
  /// @arg {string} str - the content to extract the content from
  /// @returns {string}
  getBefore(comment, str) {
    if (!comment || !str) return str
    return str.slice(0, str.indexOf(comment))
  }

  /// @name this.getAfter
  /// @description
  /// This function is used to get the content after a comment
  /// @arg {string} comment - the comment to start after
  /// @arg {string} str - the content to extract the content from
  /// @returns {string}
  getAfter(comment, str) {
    if (!comment || !str) return str
    return str.slice(str.indexOf(comment) + comment.length)
  }

  /// @name getCode
  /// @description
  /// Recursively pushes the code from each line onto the current token
  getCode() {
    const debug = this.debugGetCode
    // store the starting lines indent
    const { indent } = this.line

    const recursiveCode = () => {
      let line = to.clone(this.line)
      let str = `${line}`
      if (
        !this.is_same_multi &&
        !line.index.start &&
        line.index.end
      ) {
        line.str = str = str.slice(line.index.end + this.options.comment.end.length + 1)
      } else {
        line.str = str = str.slice(1, line.index.start || line.index.single || line.index.end || undefined)
      }


      // check to see if the current lines indent is less than the starting indent of the code
      if (!is.empty(str)) {
        this.current_blank_lines = 0
        if (this.options.indent && line.indent < indent) {
          return
        }
      } else if (++this.current_blank_lines >= this.options.blank_lines) {
        return
      }

      // push the line onto the code contents
      this.token.code.contents.push(line)

      if (
        this.hasNext() &&
        debug.ifTrue(!this.is_same_multi || !line.has_comment, `the current line(${line.lineno}) doesn't have a comment: ${clor.bgGreen(line)}`)
      ) {
        const next_line = this.peak()
        const next_msg = `the next line(${next_line.lineno}) has a comment: ${clor.bgRed(next_line)}`
        return debug.ifFalse(!next_line.has_comment, next_msg) && this.next() && recursiveCode()
      }
    }

    recursiveCode()
    debug.run()
  }

  /// @name getSingleComment
  /// @description
  /// Recursively pushes the single comment lines from each line onto the
  /// current token until the next instance of code
  getSingleComment() {
    const debug = this.debugGetSingleComment
    const { comment } = this.options
    let line = to.clone(this.line)
    line.str = this.getAfter(comment.single, `${line}`)

    this.token.comment.contents.push(line)
    const current_msg = `the current line(${line.lineno}) doesn't have code: ${clor.bgGreen(line)}`
    if (debug.ifTrue(!line.has_code, current_msg) && this.hasNext()) {
      const next_line = this.peak()
      const context = next_line.has_code ? 'has code' : 'is empty'
      const next_msg = `the next line(${next_line.lineno}) ${context}: ${clor.bgRed(next_line)}`

      this.next()
      return debug.ifFalse(next_line.has_comment && !next_line.has_code, next_msg, true) && this.getSingleComment()
    }
    debug.run()
  }

  /// @name getMultiComment
  /// @description
  /// Recursively pushes the multi line comment lines onto the
  /// current token until the next instance of code
  getMultiComment() {
    const debug = this.debugGetMultiComment
    const { comment } = this.options

    let line = to.clone(this.line)
    let str = `${line}`

    if (line.index.end) {
      str = this[this.is_same_multi ? 'getAfter' : 'getBefore'](comment.end, str)

      // update the start index if the indexes are the same
      if (this.is_same_multi && line.index.start === line.index.end) {
        line.index.start = false
      }
    }

    if (line.index.start || line.index.single) {
      str = this.getAfter(line.index.start ? comment.start : comment.single, str)
    }

    line.str = str
    this.token.comment.contents.push(line)
    debug.push(line)
    if (this.hasNext()) {
      if (debug.ifTrue(!line.index.end, `the current line(${line.lineno}) wasn't the last comment: ${clor.bgGreen(this.line)}`)) {
        debug.run()
        return this.next() && this.getMultiComment()
      }
      const next = this.peak()
      if (
        debug.ifTrue(!line.index.code, `the current line(${line.lineno}) doesn't has code: ${clor.bgGreen(line)}`) &&
        debug.ifTrue(!next.has_comment, `the next line(${next.lineno}) doesn't have a comment: ${clor.bgGreen(next)}`)
      ) {
        debug.run()
        return this.next()
      }
    }

    debug.run()
    return
  }

  /// @name pushToken
  /// @description
  /// This function is used to push the current token onto the parsed token list(`this.tokens`).
  /// It will normalize all the content that's passed to the comment and code in the token, then
  /// determin the starting and ending point for the comment and code.
  pushToken() {
    const debug = this.debugPushToken
    const { offset } = this.options
    let token = to.clone(this.token)

    const normalizeContent = (obj, set_start_end_before = false) => {
      if (is.number(offset) && offset > 0) {
        obj.contents = to.map(obj.contents, (line) => {
          line.lineno += offset
          return line
        })
      }

      // normalize the contents of the obj
      let { content, leading, trailing } = to.normalize(obj.contents.join('\n'), { info: true })
      let lines = to.array(content)
      trailing += obj.contents.length
      const points = () => {
        obj.start = (obj.contents[0] || {}).lineno || -1 // get the starting line of the comment
        obj.end = (obj.contents.slice(-1)[0] || {}).lineno || -1 // get the end line of the comment
      }

      if (set_start_end_before) points()

      obj.contents = obj.contents
        .filter((line, i) => i >= leading && i < trailing) // filter out the lines that were removed
        .map((line, i) => {
          line.str = lines[i] // update the lines content to be the normalized version
          return line
        })

      if (!set_start_end_before) points()

      if (this.isEmpty(content)) {
        obj = new Token().code
        return obj
      }

      if (!this.options.verbose) {
        obj.contents = content.split('\n')
      }

      return obj
    }

    token.comment = normalizeContent(token.comment, true)
    token.code = normalizeContent(token.code)
    debug.push(token).run()
    this.tokens.push(token)
    this.token = undefined
    this.current_blank_lines = 0
  }

  /// @name commentExisits
  /// @description
  /// this is a helper function that is used to test the existence of the comment on a given line
  commentExists(line, comment_type) {
    // ensure that the line, and comment_type are truthy
    if (is.any.falsy(line, comment_type)) {
      return false
    }

    // store the index of the comment_type
    let index = line.indexOf(comment_type)

    // check to see if the comment_type exisits
    if (index > -1) {
      if (
        is.in(line, `${comment_type} `) || // check to see if the required space after the comment_type exisits
        line.length === index + comment_type.length // check to see if the comment_type is the last thing on that line (aka <!--- --->)
      ) {
        return index
      }
    }

    return false
  }

  /// @name setDebug
  /// @description
  /// This function is used to turn the debug options on or off
  /// @arg {boolean} condition
  setDebug(condition) {
    if (is.undefined(condition)) {
      condition = this.should_debug || false
    }

    this.debugParse = this.debugSet('parse', { condition, spaces: 0 })
    this.debugGetTokens = this.debugSet('parse', { condition, spaces: 0 })
    this.debugGetSingleComment = this.debugGetTokens.set('getSingleComment', 0)
    this.debugGetMultiComment = this.debugGetTokens.set('getMultiComment', 0)
    this.debugGetCode = this.debugGetTokens.set('getCode', 0)
    this.debugPushToken = this.debugGetTokens.set('pushToken', 0)
    this.debugHasNext = this.debugGetTokens.set('hasNext', 0)
  }
}


class Token {
  constructor() {
    // The base of what each token looks like
    this.token_base = {
      comment: { contents: [], start: -1, end: -1 },
      code: { contents: [], start: -1, end: -1 }
    }

    return to.clone(this.token_base)
  }
}


class Line {
  constructor(...args) {
    args = to.arguments({
      str: '',
      lineno: ''
    }, ...args)
    to.extend(this, args)
    this.raw = this.str
    this.indent = to.indentLevel(this.str)
  }

  get length() {
    return this.str.length
  }

  toString() {
    return this.str
  }
}
