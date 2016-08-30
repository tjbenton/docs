import path from 'path'

import base_x from './base-x'
import hljs from 'highlight.js'
import to from 'to-js'


function whitespace(content) {
  return content
    .replace(/^\s+/gm, (match) => {
      var result = '<span class="hljs-leading-whitespaces">'
      result += match.replace(/ /g, '<span class="hljs-leading-whitespace"> </span>')
      result += '</span>'
      return result
    })
}

function linenos(total, start) {
  start = start || 1
  const lines = []
  for (var i = 0; i < total; i++) {
    lines.push('<span class="hljs-lineno"></span>')
  }
  return [
    `<span class="hljs-linenos" data-start="${start}" data-end="${start + total}" style="counter-reset: line ${start > 0 ? start - 1 : start}">`,
    ' ' + lines.join('\n '),
    '</span>'
  ].join('')
}


function highlight(content, options = {}) {
  options = to.extend({
    language: 'json',
    preCls: 'c-code-block',
    codeCls: 'c-code-block__code',
    lineno: true
  }, options)
  options.language = options.lang || options.language
  content = whitespace(hljs.highlight(options.language, content, true).value)

  options.lineno = options.lineno ? linenos(content.split('\n').length, options.start || 1) : ''

  return [
    `<pre class="${options.preCls} hljs ${options.language}">`,
    `<code class="${options.codeCls}">${content}</code>`,
    options.lineno,
    '</pre>'
  ].join('')
}

to.markdown({
  langPrefix: 'hljs ',
  highlight(code, language) {
    return whitespace(hljs.highlight(language, code, true).value)
  }
})

export default {
  assets: path.join(__dirname, '..', 'public-dist'),
  global: {
    base_x,
    highlight
  }
}
