/* eslint-disable no-invalid-this */
import path from 'path'

const base = path.join(__dirname, 'packages')
const packages = (folder, file = '*.js') => path.join(base, '*', folder, '**', file)
const regex = /[^/\\\\]*(public|app|src|scripts|tools|tests)/
const modify = (keep = false, name = 'dist') => {
  return (data, opts) => {
    opts.file.dir = opts.file.dir.replace(regex, keep ? `$1-${name}` : name)
    return data
  }
}

const modifyFile = (file) => {
  if (!file) return
  return path.join('packages', ...file.split('packages')[1]
    .slice(1)
    .split(path.sep)
    .map((obj) => {
      obj = obj.split('')
      if (obj.length === 1) {
        return ''
      }
      obj[0] = `[${obj[0]}]`
      return obj.join('')
    }))
}



// compiles all the javascript files and
// outputs them in the correct packages
async function build(file) {
  await this
    .source(modifyFile(file) || packages('{app,src}'))
    .babel()
    .filter(modify())
    .target(base)
}

export { build }
export default build

// copies all files that aren't `js` into
// the packages `dist` folder
export async function buildRest(file) {
  await this
  .source(modifyFile(file) || packages('{app,src}', '!(*.js)'))
  .filter(modify())
  .target(base)
}

export async function watch() {
  await this.clear('packages/*/*dist')
  await Promise.all([
    this.watch(packages('{app,src}'), 'build'),
    this.watch(packages('{app,src}', '!(*.js)'), 'buildRest'),
    this.watch(packages('{scripts,tools,tests}'), 'tools'),
    this.watch(path.join('{scripts,tools,tests}', '**', '*.js'), 'baseTools'),
    this.watch(packages('public'), 'themeJs'),
    this.watch(packages('public', '!(*.js)'), 'themeRest'),
    // this.watch(packages('{app,src}'), 'test')
  ])
}


export async function baseTools() {
  await this
    .source(path.join('{scripts,tools,tests}', '**', '*.js'))
    .babel()
    .filter(modify(true))
    .target(__dirname)
}

export async function tools(file) {
  await this
    .source(modifyFile(file) || packages('{scripts,tools,tests}'))
    .babel()
    .filter(modify(true))
    .target(base)
}


// compiles/copies themes
export async function theme() {
  await this.start([
    'themeJs',
    'themeRest'
  ], { parallel: true })
}

// compiles all js in themes public folder and
// outputs it into the `public-dist` folder
export async function themeJs(file) {
  const loose = false
  await this
    .source(modifyFile(file) || packages('public'))
    .filter(modify(true))
    .babel({
      babelrc: false,
      plugins: [
        [ 'transform-es2015-template-literals', { loose } ],
        'transform-es2015-literals',
        'transform-es2015-function-name',
        'transform-es2015-arrow-functions',
        'transform-es2015-block-scoped-functions',
        [ 'transform-es2015-classes', { loose } ],
        'transform-es2015-object-super',
        'transform-es2015-shorthand-properties',
        'transform-es2015-duplicate-keys',
        [ 'transform-es2015-computed-properties', { loose } ],
        [ 'transform-es2015-for-of', { loose } ],
        'transform-es2015-sticky-regex',
        'transform-es2015-unicode-regex',
        'check-es2015-constants',
        [ 'transform-es2015-spread', { loose } ],
        'transform-es2015-parameters',
        [ 'transform-es2015-destructuring', { loose } ],
        'transform-es2015-block-scoping',
        [ 'transform-regenerator', { async: true, asyncGenerators: true } ],
        'transform-do-expressions',
        'transform-function-bind',
        'transform-class-constructor-call',
        'transform-export-extensions',
        'transform-class-properties',
        'transform-object-rest-spread',
        'transform-decorators',
        'syntax-trailing-function-commas',
        'transform-async-to-generator',
        'transform-exponentiation-operator',
        'syntax-async-functions',
      ]
    })
    .target(base)
}

// copies all files that aren't `js` into
// the packages `public-dist` folder
export async function themeRest(file) {
  await this
    .source(modifyFile(file) || packages('public', '!(*.js)'))
    .filter(modify(true))
    .target(base)
}

export async function test() {
  await this
    .source('packages/docs-parser/tests/compair/index.js')
    .ava()
}


// const in_glob = path.join(__dirname, 'packages', '*', '{app,src}', '**', '*.js')
// const file = '/Users/tylerbenton/ui-development/docs/packages/docs-core/app/docs.js'
// const out_glob = path.join(__dirname, 'packages', '*', 'dist', '**', '*.js')
// const expected = '/Users/tylerbenton/ui-development/docs/packages/docs-core/dist/docs.js'
