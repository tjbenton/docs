var docs = require('../docs-core').default
import express from 'express'
// var express = require('express')
var app = express()


app.listen(9999, () => {
  console.log('Example app listening at http://localhost:9999')
})

try {
  docs({
    plugins: [
      '../docs-plugin-scss-content'
    ]
  })
} catch (e) {
  console.log(e)
}
