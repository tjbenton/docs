import test from 'docs-helpers-test'
import defaultAnnotations from 'docs-plugin-default-annotations'
import docsParser from '../../dist/index.js'

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
