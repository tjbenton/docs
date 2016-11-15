/* eslint-disable no-invalid-this */
import path from 'path'
import fs from 'fs-extra-promisify'

const base = path.join(__dirname, 'packages')
const packages = (folder, file = '*.js') => path.join(base, '*', folder, '**', file)
const regex = /[^/\\\\]*(public|app|src|scripts|tools|tests)/
const modify = (keep = false, name = 'dist') => {
  return (data, opts) => {
    opts.file.dir = opts.file.dir.replace(regex, keep ? `$1-${name}` : name)
    return data
  }
}

const babel_options = {
  presets: [
    'latest',
    'stage-0'
  ],
  plugins: [
    'transform-decorators-legacy',
    'transform-runtime'
  ]
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

export default async function() {
  await this.start('clean')
  await this.start([
    'build',
    'rest',
    'baseTools',
    'tools',
    'theme',
    'themeJs',
    'themeRest',
  ], { parallel: true })
}


// compiles all the javascript files and
// outputs them in the correct packages
export async function build(file) {
  await this
    .source(modifyFile(file) || packages('{app,src}'))
    .babel(babel_options)
    .filter(modify())
    .target(base)
}

// copies all files that aren't `js` into
// the packages `dist` folder
export async function rest(file) {
  await this
  .source(modifyFile(file) || packages('{app,src}', '!(*.js)'))
  .filter(modify())
  .target(base)
}

export async function clean() {
  await fs.remove(path.join('packages', '*', '*dist'))
}

export async function watch() {
  await this.start('clean')
  await Promise.all([
    this.watch(packages('{app,src}'), 'build'),
    this.watch(packages('{app,src}', '!(*.+(js|styl))'), 'rest'),
    this.watch(packages('{scripts,tools,tests}'), 'tools'),
    this.watch(path.join('{scripts,tools,tests}', '**', '*.js'), 'baseTools'),
    this.watch(packages('public'), 'themeJs'),
    this.watch(packages('public', path.join('**', '*.styl')), 'themeStyles'),
    this.watch(packages('public', '!(*.+(js|styl))'), 'themeRest'),
    // this.watch(packages('{app,src}'), 'test')
  ])
}


export async function baseTools() {
  await this
    .source(path.join('{scripts,tools,tests}', '**', '*.js'))
    .babel(babel_options)
    .filter(modify(true))
    .target(__dirname)
}

export async function tools(file) {
  await this
    .source(modifyFile(file) || packages('{scripts,tools,tests}'))
    .babel(babel_options)
    .filter(modify(true))
    .target(base)
}


// compiles/copies themes
export async function theme() {
  await this.start([
    'themeJs',
    'themeStyles',
    'themeRest'
  ], { parallel: true })
}

// compiles all js in themes public folder and
// outputs it into the `public-dist` folder
export async function themeJs(file) {
  await this
    .source(modifyFile(file) || packages('public'))
    .filter(modify(true))
    .babel({
      presets: [
        [
          'latest', {
            es2015: { loose: false, modules: false }
          }
        ],
        'stage-0'
      ],
      babelrc: false,
    })
    .target(base)
}

import globby from 'globby'

export async function themeStyles() {
  const source = path.join(base, '*', 'public', 'styles*')
  const paths = await globby([ source, path.join(source, '**', '*') ], { ignore: path.join(source, '**', '*.styl') })
  await this
    .source(path.join(source, 'index.styl'))
    .stylus({
      paths
    })
    .filter(modify(true))
    .target(base)
}

// stylus packages/docs-theme-default/public/styles/index.styl packages/docs-theme-default/public-dist/styles/index.css


// copies all files that aren't `js` into
// the packages `public-dist` folder
export async function themeRest(file) {
  await this
    .source(modifyFile(file) || packages('public', '!(*.+(js|styl))'))
    .filter(modify(true))
    .target(base)
}


// const in_glob = path.join(__dirname, 'packages', '*', '{app,src}', '**', '*.js')
// const file = '/Users/tylerbenton/ui-development/docs/packages/docs-core/app/docs.js'
// const out_glob = path.join(__dirname, 'packages', '*', 'dist', '**', '*.js')
// const expected = '/Users/tylerbenton/ui-development/docs/packages/docs-core/dist/docs.js'
