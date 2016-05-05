import { toBoolean, list } from './annotation-utils'

/// @name @chainable
/// @page annotations
/// @alias @chain
/// @description Used to notate that a function is chainable
/// @returns {boolean, array}
/// @markup Usage
/// // this will return true
/// /// @chainable
///
/// /// @chainable false
///
/// /// @chainable true
///
/// /// @chainable jQuery
///
/// /// @chainable Something, Something else
export default {
  alias: [ 'chain' ],
  parse() {
    const { contents } = this.annotation
    let bool = toBoolean(contents)
    if (bool !== undefined) {
      return bool
    }
    return list(contents)
  }
}
