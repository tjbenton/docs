import { map } from 'async-array-methods'

import assert from 'power-assert'
// import test from 'ava'
import path from 'path'
import globby from 'globby'
import fs from 'fs-extra-promisify'

export default class Tests {
  constructor(folder) {
    this.base = folder
    this.folder = path.join(process.cwd(), folder)
    this.results = this.tests = new Promise((resolve, reject) => {
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
    const result = await map(await this.expected(), async (test) => {
      test.actual = await callback(test)
      return test
    })

    this.resolve(result)
    return result
  }

  async test(t) {
    this.result = this.tests = await this.tests

    for (let i = 0; i < this.tests.length; i++) {
      let { file, actual, expected } = this.tests[i]

      try {
        assert.deepStrictEqual(actual, expected, file)
      } catch (e) {
        let json = require('jsondiffpatch')
        console.log('')
        console.log('')
        console.log('')
        console.log('')
        console.log('')
        console.log('')
        console.log(file)
        console.log('')

        const delta = json.diff(actual, expected)
        const output = json.formatters.console.format(delta)
        console.log(output);
        // console.log(e)
      }
      // if (i > 10) {
      //   t.fail(file)
      // } else {
      //   t.pass(file)
      // }
    }


    return this.result
  }
}
