import { map } from 'async-array-methods'
import assert from 'power-assert'
import path from 'path'
import globby from 'globby'
import fs from 'fs-extra-promisify'
import json from 'jsondiffpatch'

export default class Tests {
  constructor(folder) {
    this.folder = path.join(process.cwd(), folder)
    this.result = this.tests = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  async expected() {
    this.paths = await globby(path.join(this.folder, '**', '*'), {
      ignore: [ path.join(this.folder, '**', '*.json') ],
      nodir: true
    })

    return await map(this.paths, (file) => {
      return fs.readJson(file.replace(path.extname(file), '.json'))
        .then((expected) => {
          return { file, expected }
        })
    })
  }

  async actual(callback) {
    let result = await map(await this.expected(), async (test) => {
      test.actual = await callback(test)
      return test
    })

    this.resolve(result)

    return result
  }

  async test(t, log = true) {
    this.result = this.tests = await this.tests
    const pass = []
    const fail = []
    for (let i = 0; i < this.tests.length; i++) {
      let { file, actual, expected } = this.tests[i]

      try {
        assert.deepStrictEqual(actual, expected, file)
        pass.push(file)
      } catch (e) {
        const delta = json.diff(actual, expected)
        const diff = json.formatters.console.format(delta)
        fail.push({ file, diff })
      }
    }

    if (fail.length) {
      if (log) {
        const spaces = '  '
        fail.forEach((item) => {
          console.log('')
          console.log(spaces + item.file)
          console.log(item.diff.split('\n').map((line) => spaces + spaces + line).join('\n'))
          console.log('')
        })
      }
      t.fail(`${fail.length} file${fail.length > 1 ? 's' : ''} failed`)
    } else {
      t.pass(`${pass.length} file${pass.length > 1 ? 's' : ''} passed`)
    }

    return this.result
  }
}
