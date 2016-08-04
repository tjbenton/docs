import path from 'path'

// annotations
const annotations = [
  'access',
  'alias',
  'arg',
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
  assets: path.join(__dirname, '..', 'public')
}
