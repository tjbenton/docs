import { escape } from '../utils'
import to from 'to-js'
/// @name @raw-code
/// @page annotations
/// @description
/// This will output the raw code below the comment block
/// @returns {object}
export default {
  parse() {
    const raw = to.string(this.code.contents)
    return { raw, escaped: escape(raw) }
  }
}
