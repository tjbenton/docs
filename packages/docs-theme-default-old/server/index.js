require('babel-register')({
  presets: [ 'es2015', 'stage-0' ],
  plugins: [ 'transform-runtime' ]
})


module.exports = require('./app.js').default
