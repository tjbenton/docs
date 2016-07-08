/* eslint-disable no-shadow */
import test from 'ava-spec'
import Tests from '../../../docs-helpers-test/dist/index.js'
import docsParser from '../../dist/index.js'

test.group(() => {
  const suite = new Tests('cases')
  test.before(async () => {
    await suite.actual(async ({ file }) => {
      return await docsParser({
        files: file,
        debug: false,
        timestamps: false,
        warning: false,
        ignore: '.*'
      })
    })
  })

  test('cases', async (a) => {
    await suite.test(a)
  })
})
