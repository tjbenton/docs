var docs = require('../docs-core').default

try {
  docs({
    plugins: [
      '../docs-plugin-scss-content'
    ]
  })
} catch (e) {
  console.log(e)
}
