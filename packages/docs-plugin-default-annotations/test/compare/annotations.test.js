import test from 'docs-helpers-test'
import docsParser from 'docs-parser'
import defaultAnnotations from '../..'

test.compair('annotations', async (file) => {
  const result = await docsParser({
    files: file,
    raw: true,
    debug: false,
    timestamps: false,
    warning: false,
    ignore: '.*',
    ...defaultAnnotations,
  })

  return result[file]
})
