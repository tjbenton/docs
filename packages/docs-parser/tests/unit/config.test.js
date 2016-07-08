/* eslint-disable no-unused-vars, no-shadow */
import getConfig, {
  parseLanguages,
  default_options,
} from '../../dist/config'

import test from 'ava-spec'
import assert from 'power-assert'

test.group('config', (test) => {
  test('parseLanguages empty', () => {
    assert.deepStrictEqual(
      parseLanguages({
        test: {}
      }).test,
      default_options.languages.default
    )
  })

  test('parseLanguages extend', (t) => {
    const test = parseLanguages({
      rb: {
        header: { start: '###', line: '##', end: '###' },
        body: { line: '#' }
      },
      py: {
        extend: 'rb'
      }
    })
    t.is(test.rb.header.start, test.py.header.start)
    t.is(test.rb.header.line, test.py.header.line)
    t.is(test.rb.header.end, test.py.header.end)
    t.is(test.rb.body.start, test.py.body.start)
    t.is(test.rb.body.line, test.py.body.line)
    t.is(test.rb.body.end, test.py.body.end)
  })
})
