import { regex, list } from './annotation-utils'
import { to } from '../utils'

/// @name @returns
/// @page annotations
/// @alias @return
/// @description Return from the documented function
/// @returns {string}
/// @markup Usage
/// /// @returns
///
/// /// @returns {type[, type]}
///
/// /// @returns {type[, type]} - description
///
/// /// @returns {type[, type]} description
///
/// /// @returns {type[, type]}
/// /// multi
/// /// line
/// /// description
export default {
  alias: [ 'return' ],
  parse() {
    let { contents } = this.annotation
    let [ types, description ] = regex('returns', contents.shift() || '')

    if (
      types == null ||
      types === ''
    ) {
      types = 'undefined'
    }

    return {
      types: list(types),
      description: to.markdown(description, contents)
    }
  }
}
