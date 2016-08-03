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
]


for (let annotation of annotations) {
  module.exports[annotation] = require(`./${annotation}.js`)
}
