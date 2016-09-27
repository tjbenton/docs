/* eslint-disable */

console.log('')
console.log('')
console.log('')
import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import responseTime from 'response-time'
import highlight from './highlight.js'
import config from '../config.json'
import jade from 'jade'
import babel from 'jade-babel'
import clone from 'clone'

// const app = express()
//
const base_options = {
  root: path.dirname(getOrigin()),
  port: process.env.PORT,
}


// app.locals = {
//   title: "Docs",
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

//
// function getOrigin() {
//   let parent = module.parent
//   let limit = 10
//   let count = 0
//   while (!!parent) {
//     count++
//     if (parent.filename.indexOf('docs-theme-default/server/index.js') > -1) {
//       return parent.parent.filename
//     }
//     if (count >= limit) {
//       return 'well shit'
//     }
//   }
// }
