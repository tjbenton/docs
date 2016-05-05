/* eslint-disable no-unused-vars */
import assert from 'core-assert'
import asyncSuite from '../../tools/async-suite.js'
import getConfig, {
  parseLanguages,
  default_options,
} from '../../app/config'

asyncSuite('config', () => {
  return () => {
    test('parseLanguages empty', () => {
      assert.deepStrictEqual(
        parseLanguages({
          test: {}
        }).test,
        default_options.languages.default
      )
    })

    test('parseLanguages extend', () => {
      let test = parseLanguages({
        rb: {
          header: { start: '###', line: '##', end: '###' },
          body: { line: '#' }
        },
        py: {
          extend: 'rb'
        }
      })
      assert.equal(test.rb.header.start, test.py.header.start)
      assert.equal(test.rb.header.line, test.py.header.line)
      assert.equal(test.rb.header.end, test.py.header.end)
      assert.equal(test.rb.body.start, test.py.body.start)
      assert.equal(test.rb.body.line, test.py.body.line)
      assert.equal(test.rb.body.end, test.py.body.end)
    })
  }
})
