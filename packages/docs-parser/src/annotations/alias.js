import { is } from '../utils'
import { list, logAnnotationError } from './annotation-utils'

/// @name @alias
/// @page annotations
/// @arg {string, list} line - The aliases to that are avaliable for this documented item
/// @description Whether the documented item is an alias of another item
/// @returns {array}
/// @markup Usage
/// /// @alias foo
///
/// /// @alias foo, bar
///
/// /// @alias foo
/// /// @alias bar
export default {
  parse() {
    let alias_list = list(this.annotation.contents[0] || '')
    if (is.empty(alias_list)) {
      this.log.emit('warning', "You didn't pass in an alias to @alias on", logAnnotationError(this, '@alias name[, name]'))
    }

    return alias_list
  }
}
