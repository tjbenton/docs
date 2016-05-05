// import lr from 'easy-livereload'
import LRWebSocketServer from 'livereload-server'
import path from 'path'
import fs from 'fs'


let livereloadjs
const livereloadjs_base = path.join('node_modules', 'livereload-js', 'dist', 'livereload.js')
fs.readFile(path.join(process.cwd(), livereloadjs_base), 'utf8', (err, data) => {
  if (err) {
    fs.readFile(path.join(__dirname, livereloadjs_base), 'utf8', (e, d) => {
      if (e) {
        fs.readFile(path.join(__dirname, '..', livereloadjs_base), 'utf8', (a, b) => {
          if (a) throw a
          livereloadjs = b
        })
      } else {
        livereloadjs = d
      }
    })
  } else {
    livereloadjs = data
  }
})

export default function Livereload(options = {}) {
  options = Object.assign({
    id: 'default id',
    name: 'default name',
    version: '1.0',
    protocols: {
      monitoring: 7,
      saving: 1
    },
    host: 'localhost',
    port: 35729,
    file_map: {}
  }, options)

  {
    function toObject(val, ...keys) {
      let obj = {}
      for (var i = 0; i < keys.length; i++) {
        obj[keys[i]] = val
      }
      return obj
    }

    options.file_map = Object.assign(
      {},
      // `index.jade` maps to `index.html`
      toObject('html', 'hbs', 'handebars', 'ejs', 'jst', 'jsx', 'jade', 'md', 'json'),
      // `styles/site.styl` maps to `styles/site.css`
      toObject('css', 'styl', 'scss', 'sass', 'less'),
      options.file_map
    )
  }

  const server = new LRWebSocketServer(options)

  server.on('error', (err, connection) => {
    console.log('Error (%s): %s', connection.id, err.message)
  })

  server.on('livereload.js', (request, response) => {
    response.writeHead(200, {
      'Content-Length': livereloadjs.length,
      'Content-Type': 'text/javascript'
    })

    response.end(livereloadjs)
  })

  server.on('reload', (files) => {
    function sendAll(command) {
      Object.keys(server.connections).forEach((id) => {
        try {
          server.connections[id].send(command)
        } catch (e) {
          console.error('Livereload send command failed: %s', id)
        }
      })
    }

    function renameFunc(file) {
      file = path.parse(file)
      const extention = options.file_map[file.ext.slice(1)]
      if (extention) {
        file.ext = extention
      }

      return path.format(file)
    }

    for (var i = 0; i < files.length; i++) {
      let file = renameFunc(files[i])
      console.log(file)
      sendAll({
        command: 'reload',
        path: file,
        liveCSS: true
      })
    }
  })

  server.on('httprequest', (url, request, response) => {
    response.writeHead(404)
    response.end()
  })

  server.listen((err) => {
    if (err) {
      console.error('Listening failed: %s', err.message)
      return
    }
    console.log('Livereload listening on port %d.', server.port)
  })

  /* eslint-disable max-len */
  this.locals.LRScript = '' +
  '<script>' +
    'document.write(\'<script src="//\' + (location.host || \'' + options.host + '\').split(\':\')[0] + \':' + options.port + '/livereload.js?snipver=1"></\' + \'script>\');' +
    'document.addEventListener(\'LiveReloadDisconnect\', function() { setTimeout(function() { window.location.reload(); }, ' + options.reloadTimeout + '); })' +
  '</script>'
  /* eslint-enable max-len */

  return server
}
