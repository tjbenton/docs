import path from 'path'

// annotations
const annotations = [
  'access',
  'alias',
  'arg',
  'async',
  'author',
  'blockinfo',
  'chainable',
  'deprecated',
  'description',
  'markdown',
  'markup',
  'name',
  'note',
  'page',
  'property',
  'raw-code',
  'readonly',
  'requires',
  'returns',
  'since',
  'states',
  'throws',
  'todo',
  'type',
  'version',
].reduce((prev, annotation) => {
  prev[annotation] = require(`./annotations/${annotation}.js`).default
  return prev
}, {})

module.exports = {
  annotations,
  assets: path.join(__dirname, '..', 'public-dist'),
  sort: [
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
    'property',
    'raw-code>6',
    'todo>=-2',
    'type<=1',
    'version<=1',
    'blockinfo>=-1',
  ]
}
