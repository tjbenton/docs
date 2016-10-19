import docsParser from '../..'
import defaultAnnotations from 'docs-plugin-default-annotations'

const defaults = {
  warning: false,
  debug: false,
  timestamps: false,
  ignore: '.*',
  annotations: defaultAnnotations.annotations
}

export async function annotations({ file }) {
  const result = await docsParser({
    files: file,
    raw: true,
    ...defaults
  })
  return result[file]
}

export async function cases({ file }) {
  return await docsParser({
    files: file,
    ...defaults
  })
}

export async function fileTypes({ file }) {
  return await docsParser({
    files: file,
    ...defaults
  })
}

import tokenizerHelper from '../../tools/tokenizer-helper.js'
import Tokenizer from '../../dist/parser/tokenizer.js'

export async function tokenizer({ file }) {
  try {
    const obj = await tokenizerHelper(file)
    return new Tokenizer(obj.str, obj.comment)
  } catch (e) {
    console.trace(e)
  }
}
