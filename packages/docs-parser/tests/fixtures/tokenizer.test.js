/* eslint-disable no-shadow */
import test from 'ava-spec'
import Tests from 'docs-helpers-test'
import tokenizerHelper from '../../tools/tokenizer-helper.js'
import Tokenizer from '../../dist/parser/tokenizer.js'

test.group(() => {
  const suite = new Tests('tokenizer')
  test.before(async () => {
    await suite.actual(async ({ file }) => {
      try {
        const obj = await tokenizerHelper(file)
        return new Tokenizer(obj.str, obj.comment)
      } catch (e) {
        console.trace(e)
      }
    })
  })

  test('tokenizer', async (a) => {
    await suite.test(a)
  })
})
