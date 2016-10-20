import test from 'docs-helpers-test'
import tokenizerHelper from '../../tools/tokenizer-helper.js'
import Tokenizer from '../../dist/parser/tokenizer.js'

test.compair('tokenizer', async (file) => {
  try {
    const obj = await tokenizerHelper(file)
    return new Tokenizer(obj.str, obj.comment)
  } catch (e) {
    console.trace(e)
  }
})
