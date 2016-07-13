'use strict'

import express from 'express'
import harp from 'harp'
import path from 'path'

const server = express()

// server.use(express.static(__dirname + "/public"))
// server.use(harp.mount(__dirname + "/public"))



// server.set('port', options.port || 3000)
// server.locals.pretty = true
// server.set('json spaces', 2)
//
//
// app.set('views', [
//   path.join(options.root, 'views'),
//   path.join(app.dir.theme, 'app', 'views'),
// ])
//
// app.set('view engine', 'jade')

// {
//   "site_title": "Docs",
//   "seo": {
//     "facebook": {
//       "app_id": "123",
//       "admins": "",
//       "site_name": ""
//     },
//     "google_verification": "",
//     "google_analytics": "UA-",
//     "bing": "",
//     "alexa": "",
//     "pinterest": ""
//   },
//   "paths": {
//     "images": "/images",
//     "css": "/styles",
//     "js": "/js",
//     "fonts": "fonts/",
//     "icons": "/images/icons"
//   },
//   "prefetch": [],
//   "css": [
//     "index.css"
//   ],
//   "js_top": [
//     "../jspm_packages/system.js",
//     "../config.js"
//   ],
//   "js_bottom": []
// }

export default server
