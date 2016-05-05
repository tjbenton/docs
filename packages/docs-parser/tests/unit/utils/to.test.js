import to from '../../../app/utils/to.js'
import asyncSuite from '../../../tools/async-suite.js'
import fs from 'fs-extra'
import promisify from 'es6-promisify'
fs.readFile = promisify(fs.readFile)
import assert from 'core-assert'
const string = 'yo this is a string'
const array = [ 'one', 'two', 'three' ]
const object = { one: 1, two: 2, three: 3 }
const buffer = new Buffer(string)
const number = 4
const boolean = false
const file = `${process.cwd()}/tests/file-types/coffeescript/test.coffee`

asyncSuite.wrap('to', () => {
  test('to.string', async () => {
    assert.strictEqual(typeof to.string(string), 'string',
      '`string` should be converted to a typeof string')
    assert.strictEqual(typeof to.string(array), 'string',
      '`array` should be converted to a typeof string')
    assert.strictEqual(typeof to.string(buffer), 'string',
      '`buffer` should be converted to a typeof string')
    assert.strictEqual(typeof to.string(await fs.readFile(file)), 'string',
      '`read file` should be converted to a typeof string')
    assert.strictEqual(typeof to.string(object), 'string',
      '`object` should be converted to a typeof string')
    assert.strictEqual(typeof to.string(number), 'string',
      '`number` should be converted to a typeof string')
    assert.strictEqual(typeof to.string(boolean), 'string',
      '`boolean` should be converted to a typeof string')
  })

  test('to.random', () => {
    let array_test = [ 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'gray' ]

    for (let i = 0; i < 1000; i++) {
      let random_array_item = to.random(array_test)
      assert.ok(array_test.indexOf(random_array_item) > -1)
    }

    for (let i = -1000; i < 1000; i++) {
      let random_number = to.random(i, 1000)
      assert.ok(random_number >= i && random_number <= 1000)
    }
  })


  test('to.normalString', async () => {
    let result
    try {
      // this file has some stupid ass characters in it
      // that need to be removed in order to become like the
      // rest of the fucking world. #microsoftBlowsAtStandards
      const crappy_windows_file = await fs.readFile(file)
      result = to.normalString(crappy_windows_file).match(/\r/g)
      assert.equal(result, null,
        'should be a normal string')
    } catch (err) {
      assert.fail(result, null, 'the file didn\'t load')
      console.log(err.stack)
    }
  })


  test('to.type', () => {
    assert.strictEqual(to.type(string), 'string')
    assert.strictEqual(to.type(array), 'array')
    assert.strictEqual(to.type(object), 'object')
    assert.strictEqual(to.type(buffer), 'buffer')
    assert.strictEqual(to.type(number), 'number')
    assert.strictEqual(to.type(boolean), 'boolean')
  })


  test('to.keys', () => {
    const keys = to.keys(object)
    assert.strictEqual(keys[0], 'one', 'should return one')
    assert.strictEqual(keys[1], 'two', 'should return two')
    assert.strictEqual(keys[2], 'three', 'should return three')
  })

  test('to.values', () => {
    assert.deepStrictEqual(to.values(object), [ 1, 2, 3 ])
    assert.deepStrictEqual(to.values(object, '!one'), [ 2, 3 ])
    assert.deepStrictEqual(to.values(object, 'one', 'two'), [ 1, 2 ])
  })


  test('to.entries', () => {
    for (const [ i, item ] of to.entries(array)) {
      assert.ok(typeof i, 'number', '`i` should be a number')
      assert.ok(typeof item, 'string', '`i` should be a string')
    }
  })


  test('to.objectEntries', () => {
    for (const { key, one, two, three } of to.objectEntries({ test: object })) {
      assert.strictEqual(key, 'test', 'The key should be `test`')
      assert.strictEqual(one, 1, '`one` should equal 1')
      assert.strictEqual(two, 2, '`two` should equal 2')
      assert.strictEqual(three, 3, '`three` should equal 3')
    }
  })


  test('to.normalize', () => {
    const actual = `
      .foo {
        background: blue;
      }
    `
    const expected = [ '.foo {', '  background: blue;', '}' ].join('\n')

    assert.strictEqual(to.normalize(actual), expected, 'all whitespace should be stripped')
    assert.ok(actual.split('\n')[2].length > 19, 'should be greater than 19')
    assert.strictEqual(to.normalize(actual).split('\n')[1].length, 19, 'should be 19')
  })


  test('to.extend', () => {
    const temp = to.extend({}, object)
    assert.deepEqual(object, object,
      'should equal each other, because they\'re the same')
    assert.deepEqual(temp, object,
      'should be the same as the first object')
    assert.strictEqual(to.extend(temp, { one: 3 }).one, 3,
      '`one` should be equal to 3')
  })


  test('to.clone', () => {
    const actual = { one: { two: { three: { four: { five: 'whatup' } } } } }
    const expected = { one: { two: { three: { four: { five: 'whatup' } } } } }
    const test_one = to.clone(actual)
    test_one.test = 'yo'
    assert.ok(actual.test === undefined,
      '`acutal.test` should not be defined')
    assert.ok(test_one.test === 'yo',
      '`test_one.test` should equal yo')
    assert.deepEqual(actual, expected,
      'the actual object should remain the same as the expected object')
  })


  test('to.merge', () => {
    const a = {
      foo: {
        bar: '1',
        baz: [ '3', '4' ],
        qux: 'one',
        quux: { garply: { waldo: 'one' } }, waldo: ''
      }
    }
    const b = {
      foo: {
        bar: '2',
        baz: [ '5', '6' ],
        qux: [ 'two', 'three' ],
        quux: { garply: { waldo: 'two' } },
        waldo() {
          return this
        },
        garply: 'item'
      }
    }
    assert.strictEqual(a.foo.bar, '1', 'a.foo.bar should be 1')
    to.merge(a, b)
    assert.ok(Array.isArray(a.foo.bar), 'a.foo.bar should be an array')
    assert.ok(Array.isArray(a.foo.baz), 'a.foo.baz should be an array')
    assert.ok(Array.isArray(a.foo.quux.garply.waldo),
      'a.foo.quux.garply.waldo should be an array')
  })

  test('to.filter', () => {
    assert.deepStrictEqual(
      to.filter(array, (obj) => obj !== 'one'),
      [ 'two', 'three' ]
    )
    assert.deepStrictEqual(
      to.filter(array, (obj) => obj !== 'two'),
      [ 'one', 'three' ]
    )
    assert.deepStrictEqual(
      to.filter(object, ({ key }) => key !== 'one'),
      { two: 2, three: 3 }
    )
    assert.deepStrictEqual(
      to.filter(object, ({ value }) => value !== 1),
      { two: 2, three: 3 }
    )
  })

  test('to.map', () => {
    assert.deepStrictEqual(
      to.map(array, (item) => item + ' test'),
      [ 'one test', 'two test', 'three test' ]
    )
    assert.deepStrictEqual(
      to.map(object, ({ key, value }) => {
        return { [`${key} test`]: value }
      }),
      { 'one test': 1, 'two test': 2, 'three test': 3 }
    )
  })

  test('to.reduce', () => {
    assert.deepStrictEqual(
      to.reduce([ object, object, object ], (previous, next) => to.extend(previous, next), {}),
      object
    )

    assert.deepStrictEqual(
      to.reduce(object, (previous, { key }) => {
        return [ ...previous, key ]
      }, []),
      array
    )
  })


  test('to.object', async () => {
    try {
      const json = await fs.readFile(`${process.cwd()}/package.json`)
      assert.ok(to.object(json).author,
        'the passed json should now be an object')
    } catch (err) {
      console.log(err.stack)
    }
  })


  test('to.json', () => {
    const obj = { foo: 'foo', bar: 'foo' }
    assert.strictEqual(typeof obj, 'object',
      'the test object should be an object')
    assert.strictEqual(typeof to.json(obj), 'string',
      'should be a json string')
  })


  test('to.array', () => {
    assert.ok(Array.isArray(array),
      'array should should be an array')
    assert.ok(Array.isArray(to.array(array)),
      'array should be be returned with no changes')
    assert.ok(!Array.isArray(string),
      'string should not be an array')
    assert.ok(Array.isArray(to.array(string)),
      'string should be converted to a type of array')
    assert.ok(!Array.isArray(object),
      'object should not be an array')
    assert.ok(Array.isArray(to.array(object)),
      'object should be converted to a type of array')
    assert.ok(!Array.isArray(number),
      'number should not be an array')
    assert.ok(Array.isArray(to.array(number)),
      'number should be converted to a type of array')
  })


  test('to.flatten', () => {
    assert.strictEqual(to.flatten([ [ [ array ] ] ])[0], 'one',
      'the array should be flattend and the first value should be one')
  })


  test('to.unique', () => {
    assert.strictEqual(to.unique([ 'one', 'one', 'two', 'two' ]).length, 2,
      'should have a length of 2')
  })


  test('to.sort', () => {
    const acutal_object = {
      c: 1,
      b: 2,
      a: 3
    }
    const actual_array = [ 3, 2, 1 ]

    assert.strictEqual(Object.keys(acutal_object)[0], 'c',
      'c should be the first key in the object')
    assert.strictEqual(Object.keys(to.sort(acutal_object))[0], 'a',
      'a should be the first key in the object after it\'s sorted')

    assert.strictEqual(actual_array[0], 3)
    assert.strictEqual(to.sort(actual_array)[0], 1)
  })


  test('to.number', () => {
    assert.strictEqual(to.number(4), 4,
      'should be 4')
    assert.strictEqual(to.number([ 'a', 'b', 'c' ]), 3,
      'should be 3')
    assert.strictEqual(to.number({ a: 1, b: 2, c: 3 }), 3,
      'should be 3')
    assert.strictEqual(to.number('foo'), 0,
      'should be 0')
    assert.strictEqual(to.number('10'), 10,
      'should be 10')
    assert.strictEqual(to.number(false), 0,
      'should be 0')
    assert.strictEqual(to.number(true), 1,
      'should be 1')
  })
})
