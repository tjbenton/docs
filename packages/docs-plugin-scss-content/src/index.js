// @todo update import link
import { toBoolean, list } from '../../docs-parser/dist/annotations/annotation-utils'

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
  }
}