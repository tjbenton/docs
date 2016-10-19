import test from 'docs-helpers-test'
import docsParser from '../../../docs-parser'

test.compair('annotations', async (file) => {
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
