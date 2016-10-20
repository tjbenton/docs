
import defaultAnnotations from '../..'
import docsParser from '../../../docs-parser'

export async function annotations({ file }) {
  const result = await docsParser({
    files: file,
    raw: true,
    warning: false,
    debug: false,
    timestamps: false,
    ignore: '.*',
    ...defaultAnnotations,
  })
  return result[file]
}
