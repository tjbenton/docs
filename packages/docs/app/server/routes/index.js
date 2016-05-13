import express from 'express'
import fs from 'fs'
import path from 'path'

export default function routes(app) {
  let router = express.Router() // eslint-disable-line
  let controllers = require('../controllers/index.js').default(app)

  // load all other routes
  fs
    .readdirSync(__dirname)
    .forEach((route) => {
      // set the key to the controller then require it
      var key = route.replace(/\.js$/, '')
      // require the route as long as it is not index.js because that is the one we are in
      if (key !== 'index') {
        router = require(path.join(__dirname, route)).default(app, router, controllers)
      }
    })

  let valid_url = /\/[a-z~!@#$%^&*()_+`0-9-=\[\]\\{}|:";'<>,/]*(?:\?|#=.*)?$/i // eslint-disable-line
  app.get(valid_url, controllers.index)

  return router
}
