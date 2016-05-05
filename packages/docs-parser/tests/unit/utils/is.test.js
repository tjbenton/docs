import is from '../../../app/utils/is.js'
import assert from 'core-assert'
import asyncSuite from '../../../tools/async-suite.js'


asyncSuite.wrap('is', () => {
  test('is.false', () => {
    assert.ok(!is.false('foo'),
      'should return false if a string is passed')
    assert.ok(!is.false(0),
      'should return false if a number is passed')
    assert.ok(is.false(false),
      'should return true if false is pased to it')
  })

  test('is.fn', () => {
    assert.ok(is.fn(test),
      'should return true if it is passed a function')
    assert.ok(!is.fn('foo'),
      'should return false if passed a string')
  })

  test('is.in', () => {
    const array = [ 'one', 'two', 'three' ]
    const object = { one: 1, two: 2, three: 3 }
    const string = 'onetwothree'
    assert.ok(is.in(array, 'two'),
      'should return true when the item is in the array')
    assert.ok(!is.in(array, 'four'),
      'should return false when the item is not in the array')
    assert.ok(is.in(object, 'two'),
      'should return true when the item is in the object')
    assert.ok(!is.in(object, 'four'),
      'should return false when the item is not in the object')
    assert.ok(is.in(string, 'two'),
      'should return true when the item is in the string')
    assert.ok(!is.in(string, 'four'),
      'should return false when the item is not in the string')
  })

  test('is.all.in', () => {
    const array = [ 'one', 'two', 'three' ]
    const object = { one: 1, two: 2, three: 3 }
    const string = 'onetwothree'
    assert.ok(is.all.in(array, 'one', 'two'),
      'should return true because all items are in the array')
    assert.ok(!is.all.in(array, 'one', 'four'),
      'should return false because one item isn\'t in the array')
    assert.ok(is.all.in(object, 'one', 'two'),
      'should return true because all items are in the object')
    assert.ok(!is.all.in(object, 'one', 'four'),
      'should return false because one item isn\'t in the object')
    assert.ok(is.all.in(string, 'one', 'two'),
      'should return true because all items are in the string')
    assert.ok(!is.all.in(string, 'one', 'four'),
      'should return false because one item isn\'t in the string')
  })

  test('is.any.in', () => {
    const array = [ 'one', 'two', 'three' ]
    const object = { one: 1, two: 2, three: 3 }
    const string = 'onetwothree'
    assert.ok(is.any.in(array, 'one', 'four'),
      'should return true because one is in the array')
    assert.ok(!is.any.in(array, 'four', 'five'),
      'should return false because none of the passed arguments are in the array')
    assert.ok(is.any.in(object, 'one', 'four'),
      'should return true because one is in the object')
    assert.ok(!is.any.in(object, 'four', 'five'),
      'should return false because none of the passed arguments are in the object')
    assert.ok(is.any.in(string, 'one', 'four'),
      'should return true because one is in the string')
    assert.ok(!is.any.in(string, 'four', 'five'),
      'should return false because none of the passed arguments are in the string')
  })

  test('is.plainObject', () => {
    assert.ok(is.plainObject({}),
      'should return true if passed a {}')
    assert.ok(!is.plainObject([]),
      'should return false if passed a []')
    assert.ok(!is.plainObject(''),
      'should return false if passed a string')
    assert.ok(!is.plainObject(test),
      'should return false if passed a function')
  })

  test('is.between', () => {
    assert.ok(is.between(200),
      'should return true because 200 is between 0 and Infinity')
    assert.ok(is.between(0),
      'should return true because 0 is between 0 and Infinity')
    assert.ok(is.between(-100, -1000),
      'should return true because -100 is between -1000 and infinity')
    assert.ok(!is.between(-1),
      'should return false because -1 is not between 0 and infinity')
  })

  test('is.promise', () => {
    async function something_async() {
      return await Promise.resolve('some cool stuff')
    }
    assert.ok(!is.promise('foo'),
      'should return false because a string is not a promise')
    assert.ok(!is.promise(test),
      'should return false because tape is not a promise')
    assert.ok(is.promise(something_async()),
      'should return true because something_async is an async function')
    assert.ok(is.promise(Promise.resolve('')),
      'should return true because it is a promise')
  })

  test('is.buffer', () => {
    const string = 'foo bar'
    const some_buffer = new Buffer(string)
    assert.ok(is.buffer(some_buffer),
      'should return true because it is a buffer')
    assert.ok(!is.buffer(string),
      'should return false because a string is not a buffer')
  })

  test('is.symbol', () => {
    const string = 'foo bar'
    assert.ok(is.symbol(Symbol(string)),
      'should return true because it is a symbol')
    assert.ok(!is.symbol(string),
      'should return false because it is a string')
  })
})
