import test from 'docs-helpers-test'
import defaultAnnotations from 'docs-plugin-default-annotations'
import docsParser from '../../dist/index.js'

test.compair('cases', (file) => {
  return docsParser({
    files: file,
    debug: false,
    timestamps: false,
    warning: false,
    ignore: '.*',
    ...defaultAnnotations,
  })
})
