import test from 'ava'
import Tests from 'docs-helpers-test'
import docsParser from '../../dist/index.js'

let suite = new Tests('annotations')
test.before(async () => {
  await suite.actual(async ({ file }) => {
    const result = await docsParser({
      files: file,
      raw: true,
      debug: false,
      timestamps: false,
      warning: false,
      ignore: '.*'
    })

    return result[file]
  })
})

test('annotations', async (a) => {
  await suite.test(a)
})
