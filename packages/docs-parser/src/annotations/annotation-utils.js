import { is, to } from '../utils'
import clor from 'clor'

// holds all the base regex expressions for the annotations
// They're broken down so they can be reused instead of writing the same
// regexp over and over with slightly different variations
let regexes

{
  const types = '(?:{(.*)})?'
  const name = '([^\\s]*)?'
  const space = '(?:\\s*)?'
  const value = '(?:\\[(.*)\\])?'
  const id = '(?:\\((.*)\\))?'
  const description = '(?:\\s*\\-?\\s+)?(.*)?'

  let rg = {}

  rg.arg =
  rg.property = to.regex(types, space, name, space, value, space, description, 'i')

  rg.markup = to.regex(id, space, types, space, value, space, description, 'i')

  rg.deprecated =
  rg.note =
  rg.throws =
  rg.returns =
  rg.since =
  rg.type =
  rg.version = to.regex(types, space, description, 'i')

  rg.requires = to.regex(types, space, name, description, 'i')

  rg.state_id = to.regex(id, space, '(.*)', 'i')

  rg.state =
  rg.todo = to.regex(types, space, value, space, description, 'i')

  regexes = rg
}

export function regex(name, str) {
  return regexes[name].exec(`${str}`).slice(1)
}

function list(arg) {
  if (is.array(arg)) {
    return to.map(arg, list)
  }

  if (arg == null) {
    return []
  }

  return to.array(`${arg}`, ',').map((item) => item.trim()).filter(Boolean)
}

export { list }

export function toBoolean(contents) {
  let line = `${contents[0]}`
  if (!is.empty(contents.slice(1))) {
    return undefined
  }

  if (line === 'false') {
    return false
  } else if (
    is.undefined(line) ||
    line.length === 0 ||
    line === 'true'
  ) {
    return true
  }

  return undefined
}

export function logAnnotationError(obj, expected) {
  expected = to.array(expected)
  const {
    annotation,
    comment,
    code,
    file,
    options
  } = obj

  const total_lines = ~~((11 + (annotation.end - annotation.start)) / 2)

  let indent = '  '
  indent += '  '

  const getSpaces = (number) => (number + '').split('').filter(Boolean).map(() => ' ').slice(1).join('')

  comment.contents = to.array(comment.contents)
  code.contents = to.array(code.contents)

  // used to modifiy the indention of numbers so that they align to the right
  let modifier = getSpaces(file.end)
  let temp_contents = to.flatten([ comment.contents, code.contents ])
  let comment_style = options.language[comment.type].single
  // The line below should get the correct length but it currently doesn't
  // let total_comment_lines = comment.end - comment.start
  let total_comment_lines = comment.contents.length - 1
  let contents = []
  let expected_contents = []


  // @todo the code block doesn't return the correct number in some cases
  code.end = code.end > -1 ? code.end : file.end

  for (let i = comment.start; i < code.end; i++) {
    let index = i - comment.start
    let line = temp_contents[index]
    let line_number = i + 1
    let is_in_comment = is.between(index, 0, total_comment_lines)
    // let

    if (getSpaces(line_number) === modifier) {
      modifier = modifier.slice(1)
    }

    if (is.between(index, annotation.start, annotation.end)) {
      let expected_line = expected[index - annotation.start]

      if (expected_line) {
        contents.push(
          `${indent.slice(2)}${clor.red('-')} ${modifier}${clor.red(line_number)} | ${comment_style} ${clor.bgRed(line)}`
        )
        expected_contents.push(
          `${indent.slice(2)}${clor.green('+')} ${modifier}${clor.green(line_number)} | ${comment_style} ${clor.bgGreen(expected_line)}`
        )
      }

      if (
        expected_contents !== undefined && (
          !expected_line ||
          index === annotation.end
        )
      ) {
        contents.push(...expected_contents)
        expected_contents = undefined
      }

      if (!expected_line) {
        contents.push(
          `${indent}${modifier}${line_number} | ${comment_style} ${line}`
        )
      }
    } else {
      if (is_in_comment) {
        line = `${comment_style} ${line}`
      }
      contents.push(`${indent}${modifier}${line_number} | ${line}`)
    }
  }

  // trim the contents so there's not to much showing
  contents = contents.slice(
    to.clamp(annotation.start - total_lines, 0, contents.length),
    to.clamp(annotation.end + total_lines, 0, contents.length)
  )


  contents.unshift(...[
    '',
    `${indent}${clor.bold(file.path)}`, // adds the file path of the error
    `${indent}${clor.green('+ expected')} ${clor.red('- actual')}`, // adds a legend
    ''
  ])
  contents.push(...[ '', '' ])

  return contents.join('\n')
}


export function escape(arg) {
  return to.array(arg)
    .map((line) => {
      return line.replace(/[&<>'"]/g, (match) => {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          '\'': '&#39;'
        }[match]
      })
    })
    .join('\n')
}
