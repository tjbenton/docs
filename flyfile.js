/* eslint-disable no-invalid-this */
import path from 'path'

const packages = (folder) => path.join('packages', '*', folder, '**', '*.js')
function modify(dir, name) {
  dir = dir.split(path.sep)
  dir[2] = name
  return dir.join(path.sep)
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

const mocha = {
  compilers: 'js:babel-register',
  ui: 'tdd',
  'check-leaks': true,
  colors: true,
  delay: true,
  bail: true
}


export async function noop() {}
async function change(globs, tasks, options = { parallel: true }) {
  tasks = typeof tasks === 'string' ? [ tasks ] : tasks
  const watcher = await this.watch(globs, 'noop')
  watcher.on('all', async (type, glob) => {
    options.value = null
    type = type.replace(/[a-z]+/, (match) => {
      return { add: 'Added ', change: 'Changed', unlink: 'Removed ' }[match] || ''
    }).trim()

    // log the event
    this.log(`${type} ${glob}`)

    // if a single file was passed, then pass in the file to the tasks
    if (!!path.extname(glob)) {
      options.value = glob
    }

    await this.start(tasks, options)
  })
  .on('error', this.error)
  await this.start(tasks)
}

async function build(file) {
  await this
    .source(file || packages('{app,src}'))
    .babel(babel)
    .filter((data, opts) => {
      opts.file.dir = modify(opts.file.dir, 'dist')
      return data
    })
    .target('packages')
}

export { build }
export default build

export async function watch() {
  await Promise.all([
    change.call(this, packages('{app,src}'), 'build'),
    change.call(this, packages('{scripts,tools,tests}'), 'tools'),
    change.call(this, path.join('{scripts,tools,tests}', '**', '*.js'), 'baseTools')
  ])
  // await this.watch(packages('{app,src}'), 'build')
  // await this.watch(packages('{scripts,tools,tests}'), 'tools')
  // await this.watch(path.join('{scripts,tools,tests}', '**', '*.js'), 'baseTools')
  // await this.watch(packages('{app,src}'), 'test')
}

export async function baseTools(file) {
  await this
    .source(file || path.join('{scripts,tools,tests}', '**', '*.js'))
    .babel(babel)
    .filter((data, opts) => {
      opts.file.dir = `${opts.file.dir}-dist`
      return data
    })
    .target('./')
}

export async function tools(file) {
  await this
    .source(file || packages('{scripts,tools,tests}'))
    .babel(babel)
    .filter((data, opts) => {
      opts.file.dir = modify(opts.file.dir, opts.file.dir.split(path.sep)[2] + '-dist')
      return data
    })
    .target('packages')
}

export async function test() {
  await this
    .source('packages/docs-parser/tests/compair/index.js')
    .ava()
  // await this.start([ 'testUnit', 'testMock' ])
}

export async function testUnit() {
  await this
    .source(packages(path.join('tests', 'unit')))
    .babel(babel)
    .mocha(mocha)
}

export async function testMock() {
  // await this
  //   .source(path.join('packages', '*', 'tests', 'run.test.js'))
  //   .babel(babel)
  //   .mocha(mocha)
}

// import globby from 'globby'
// export async function test() {
//   let base = __dirname
//   let pkgs = await globby(path.join('packages', '*', 'flyfile.js'))
//   for (let pkg of pkgs) {
//     pkg = pkg.split(path.sep).slice(0, -1).join(path.sep)
//     pkg = path.join(base, pkg)
//   }
// }
