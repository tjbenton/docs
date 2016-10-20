/* eslint-disable no-shadow */
import sort from '../../../dist/parser/sort.js'
import test from 'ava-spec'

test.group((test) => {
  const tests = [
    {
      title: 'do nothing',
      actual: [ 'a', 'b', 'c' ],
      expected: [ 'a', 'b', 'c' ],
    },
    {
      title: 'do nothing',
      actual: [ 'a>=0', 'b', 'c' ],
      expected: [ 'a', 'b', 'c' ],
    },
    {
      title: 'do nothing',
      actual: [ 'a<=0', 'b<=0', 'c<=1' ],
      expected: [ 'a', 'b', 'c' ],
    },
    {
      title: 'do nothing',
      actual: [ 'a>=0', 'b', 'c' ],
      expected: [ 'a', 'b', 'c' ],
    },
    {
      title: 'do nothing',
      actual: [ 'a>-4', 'b', 'c' ],
      expected: [ 'a', 'b', 'c' ],
    },
    {
      title: 'move to last',
      actual: [ 'a>', 'b', 'c' ],
      expected: [ 'b', 'c', 'a' ],
    },
    {
      title: 'move to last',
      actual: [ 'a>0', 'b', 'c' ],
      expected: [ 'b', 'c', 'a' ],
    },
    {
      title: 'move to last',
      actual: [ 'a>1', 'b', 'c' ],
      expected: [ 'b', 'c', 'a' ],
    },
    {
      title: 'move to last',
      actual: [ 'a>2', 'b', 'c' ],
      expected: [ 'b', 'c', 'a' ],
    },
    {
      title: 'move to last',
      actual: [ 'a>3', 'b', 'c' ],
      expected: [ 'b', 'c', 'a' ],
    },
    {
      title: 'move to last',
      actual: [ 'a>3', 'b', 'c' ],
      expected: [ 'b', 'c', 'a' ],
    },
    {
      title: 'move to last',
      actual: [ 'a>-1', 'b', 'c' ],
      expected: [ 'b', 'c', 'a' ],
    },
    {
      title: 'move 1',
      actual: [ 'a>0', 'b', 'c=1' ],
      expected: [ 'b', 'a', 'c' ],
    },
    {
      title: 'move last to first',
      actual: [ 'a<=1', 'b<=2', 'c<=0' ],
      expected: [ 'c', 'a', 'b' ],
    },
    {
      title: 'dedupe',
      actual: [ 'a<=1', 'b<=2', 'c<=0', 'a' ],
      expected: [ 'c', 'a', 'b' ],
    },
    {
      title: 'all the things',
      actual: [
        'a<=2',
        'b>6',
        'c>5',
        'd>5',
        'e>=-3',
        'f>6',
      ],

      expected: [
        'a',
        'e',
        'c',
        'd',
        'b',
        'f'
      ],
    },
    {
      title: 'WOOHOO',
      actual: [
        'name<=0',
        'access<=0',
        'author<=1',
        'deprecated<=1',
        'description<=1',
        'arg<=2',
        'async<=2',
        'markdown>6',
        'markup>5',
        'states>5',
        'note>=-3',
        'raw-code>6',
        'todo>=-2',
        'type<=1',
        'version<=1',
        'blockinfo>=-1',
      ],
      expected: [
        'access',
        'name',
        'author',
        'deprecated',
        'description',
        'type',
        'version',
        'arg',
        'async',
        'markup',
        'states',
        'markdown',
        'raw-code',
        'note',
        'todo',
        'blockinfo',
      ],
    }
  ]


  tests.forEach(({ title, actual, expected, options = {} }) => {
    test(`${title} [ '${actual.join('\', \'')}' ]`, (t) => {
      let result = sort(actual, options)

      if (!expected) {
        console.log(result)
        t.pass()
        return
      }
      t.deepEqual(result, expected)
    })
  })

  // 'name<=0',
  // 'access<=0',
  // 'author<=1',
  // 'deprecated<=1',
  // 'description<=1',
  // 'arg<=2',
  // 'async<=2',
  // 'markdown>6',
  // 'markup>5',
  // 'states>5',
  // 'note>=-3',
  // 'raw-code>6',
  // 'todo>=-2',
  // 'type<=1',
  // 'version<=1',
  // 'blockinfo>=-1',
})
