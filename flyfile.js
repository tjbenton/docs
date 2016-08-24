/* eslint-disable no-invalid-this */
import path from 'path'

const base = path.join(__dirname, 'packages')
const packages = (folder) => path.join(base, '*', folder, '**', '*.js')
const regex = /[^/\\\\]*(app|src|scripts|tools|tests)/
const modify = (keep = false, name = 'dist') => {
  return (data, opts) => {
    opts.file.dir = opts.file.dir.replace(regex, keep ? `$1-${name}` : name)
    return data
  }
}
const out = (file) => {
  return !!file ? file.replace(/(?:app|src|scripts|tools|tests).*/, '') : base
}

const babel = {
  presets: [ 'es2015', 'stage-0' ],
  plugins: [
    'syntax-async-functions',
    'transform-async-to-generator',
    'transform-decorators-legacy',
    'transform-regenerator',
    'transform-runtime',
  ]
}

async function build(file) {
  await this
    .source(file || packages('{app,src}'))
    .babel(babel)
    .filter(modify())
    .target(out(file))
}

export { build }
export default build

export async function watch() {
  await Promise.all([
    this.watch(packages('{app,src}'), 'build'),
    this.watch(packages('{scripts,tools,tests}'), 'tools'),
    this.watch(path.join('{scripts,tools,tests}', '**', '*.js'), 'baseTools')
    // await this.watch(packages('{app,src}'), 'test')
  ])
}

export async function baseTools() {
  await this
    .source(path.join('{scripts,tools,tests}', '**', '*.js'))
    .babel(babel)
    .filter(modify(true))
    .target(__dirname)
}

export async function tools(file) {
  await this
    .source(file || packages('{scripts,tools,tests}'))
    .babel(babel)
    .filter(modify(true))
    .target(out(file))
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
