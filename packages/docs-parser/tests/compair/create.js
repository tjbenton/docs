import docsParser from '../..'

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export async function annotations({ file }) {
  const result = await docsParser({
    files: file,
    warning: false,
    debug: false,
    timestamps: false,
    raw: true,
    ignore: '.*'
  })
  return result[file]
}
