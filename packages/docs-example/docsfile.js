'use strict'

import docs from 'docs-core'

try {
  docs({
    plugins: [
      '../docs-plugin-scss-content'
    ]
  })

  docs.logger.on('parsed', (data, files) => {
    // console.log('parsed:', files)
  })

  console.log(docs.server)
  // docs.server('../docs-theme-default')
} catch (e) {
  console.log(e)
}
