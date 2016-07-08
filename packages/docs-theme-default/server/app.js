/*
  eslint
  no-var: 0,
  no-magic-numbers: 0,
  prefer-arrow-callback: 0,
  prefer-template: 0,
  object-shorthand: 0,
  no-underscore-dangle: 0
*/
console.log('')
console.log('')
console.log('')
import express from 'express'
import path from 'path'
// import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
// import responseTime from 'response-time'
import highlight from './highlight.js'
import config from '../config.json'
import docsTwo from '../docs2.json'
import jade from 'jade'
import babel from 'jade-babel'
import clone from 'clone'


const root = {
  project: process.cwd(),
  theme: path.join(__dirname, '..')
}

const base_options = {
  root: path.dirname(getOrigin()),
  port: process.env.PORT,
}

export default function(options = {}) { // eslint-disable-line
  options = Object.assign(base_options, options)
  // The main app
  const app = express()

  // base locals
  app.locals = config

  app.dir = {
    theme: path.join(__dirname, '..'),
    app: path.join(__dirname, '..', 'app'),
    public: path.join(__dirname, '..', 'public'),
    project: path.dirname(getOrigin())
  }

  try {
    app.locals.pkg = require(path.join(app.dir.project, '..', 'package.json')) // the package for the project this is being used on
  } catch (e) {
    app.locals.pkg = {}
  }

  // sets the port
  app.set('port', options.port || 3000)
  app.locals.pretty = true
  app.set('json spaces', 2)

  // view engine setup
  app.set('views', [
    path.join(options.root, 'views'),
    path.join(app.dir.theme, 'app', 'views'),
  ])

  app.set('view engine', 'jade')


  // app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  // app.use(responseTime())

  app.locals.prefix = 'docs'

  app.locals.utils = {}
  app.locals.utils.path = path
  app.locals.utils.getType = (obj) => obj.toString().slice(8, -1).toLowerCase()
  app.locals.utils.random = (min, max) => min === max ? min : Math.floor(Math.random() * (max - min + 1)) + min

  app.locals.highlight_types = highlight.highlight_types
  app.locals.highlight = highlight.highlight
  app.locals.syntax_highlight = highlight.syntax_highlight

  // adds the ability to use es6 inline
  babel({}, jade)

  // adds stylus support
  const styles = require('./styles.js').default
  styles(app)

  app.use(express.static(path.join(root.theme, 'public')))
  app.use(express.static(path.join(root.project, '')))

  const base = require('./base-x.js').default
  // This cas be used in the jade files to generate a unique id for a section
  app.locals.encode = base.encodeString

  // const search = require('./build-search.js')
  const routes = require('./routes').default
  routes(app)

  // const type = (arg) => Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
  //
  // app.push = function push(setting, ...values) {
  //   let initial = this.setting[setting]
  //   if (type(initial) !== 'array') {
  //     initial = [ initial ]
  //   }
  //
  //   initial.push(...values)
  //
  //   this.set(setting, initial)
  // }


  // app.get('*.svg', function svg(req, res) {
  //   res.setHeader('Content-Type', 'image/svg+xml');
  // });

  // this allows users to run `app.livereload()` to enable live reload
  app.livereload = require('./livereload').default

  // const routerTable = require('./router-table.js').default
  // start the server
  // app.listen(app.get('port'), () => {
  //   console.log(`Example app listening at http://localhost:${app.get('port')}`)
  //   routerTable(app._router.stack)
  // })


  let globals = clone(app.locals)
  const globals_to_delete = [ 'nav', 'pages', 'utils', 'LRScript', 'highlight_types' ]
  for (let key in globals) {
    if (globals.hasOwnProperty(key)) {
      if (
        typeof globals[key] === 'function' ||
        globals_to_delete.indexOf(key) > -1
      ) {
        delete globals[key]
      }
    }
  }

  const documentation = []

  for (var file in docsTwo) {
    if (docsTwo.hasOwnProperty(file)) {
      documentation.push(docsTwo[file])
    }
  }

  app.locals.documentation = documentation

  app.locals.jade_globals = JSON.stringify(globals, null, 2)


  const fakelength = []
  function createFakeArray(l) {
    var arr = []
    for (var i = 0; i < l; i++) {
      arr[i] = i
    }
    return arr
  }
  for (var i = 0; i < 200; i++) {
    fakelength[i] = createFakeArray(i)
  }

  app.locals.fakelength = fakelength
  app.locals.locals = app.locals
  return app
}


function getOrigin() {
  let parent = module.parent
  let limit = 10
  let count = 0
  while (!!parent) {
    count++
    if (parent.filename.indexOf('docs-theme-default/server/index.js') > -1) {
      return parent.parent.filename
    }
    if (count >= limit) {
      return 'well shit'
    }
  }
}
