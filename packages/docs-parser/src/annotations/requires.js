import { regex, list } from './annotation-utils'
import { to } from '../utils'

/// @name @requires
/// @page annotations
/// @alias @require
/// @description Requirements from the documented item
/// @returns {object}
///
/// @markup Usage
/// /// @requires {type[, type]}
///
/// /// @requires name
///
/// /// @requires description
///
/// /// @requires {type[, type]} name - description
///
/// /// @requires {type[, type]} name description
export default {
  alias: [ 'require' ],
  parse() {
    let { contents } = this.annotation
    const [ types, name = '', description ] = regex('requires', contents.shift() || '')

    return [
      {
        types: list(types),
        name,
        description: to.markdown(description, contents)
      }
    ]
  }
}
