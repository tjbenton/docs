import assert from 'power-assert'
import path from 'path'
import fs from 'fs-extra-promisify'
import json from 'jsondiffpatch'

import readDir from 'recursive-readdir-sync'
import ava from 'ava-spec'

ava.compair = function Compair(folder, options = {}) {
  if (typeof folder === 'object') {
    options = folder
    folder = options.folder
  }

  if (typeof options === 'function') {
    options = { actual: options }
  }

  options = Object.assign({
    actual() {},
    test: false,
    diff: true
  }, options)

  const root = process.cwd()
  const files = readDir(path.join(root, folder)).filter((file) => !file.includes('.json'))

  const createTest = (file) => {
    const test = this.group(file.slice(root.length + 1))

    test(async (t) => {
      let actual = options.actual(file, t)
      let expected = fs.readJson(file.replace(path.extname(file), '.json'))

      actual = await actual
      expected = await expected

      if (options.test) {
        options.test(t, { file, actual, expected })
        if (!options.diff) {
          return
        }
      }

      try {
        assert.deepStrictEqual(actual, expected, file)
        t.pass(file)
      } catch (e) {
        const delta = json.diff(actual, expected)
        const diff = json.formatters.console.format(delta)
        const spaces = '  '
        t.fail(file)
        console.log('')
        console.log(spaces + file)
        console.log(diff.split('\n').map((line) => spaces + spaces + line).join('\n'))
        console.log('')
      }
    })
  }

  for (let file of files) {
    createTest(file)
  }
}

export default ava
