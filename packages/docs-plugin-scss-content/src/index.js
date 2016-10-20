import { toBoolean, list } from '../../docs-plugin-default-annotations/dist/utils.js'
import path from 'path'

export default {
  annotations: {
    content: {
      parse() {
        const { contents } = this.annotation
        let bool = toBoolean(contents)
        if (bool !== undefined) {
          return bool
        }
        return list(contents)
      }
    }
  },
  assets: path.join(__dirname, '..', 'public')
}
