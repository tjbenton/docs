import { toBoolean, list } from '../utils'

/// @name @chainable
/// @page annotations
/// @alias @chain
/// @description Used to notate that a function is chainable
/// @returns {boolean, array}
/// @markup Usage
/// // this will return true
/// /// @chainable
///
/// /// @chainable true
///
/// /// @chainable false
///
/// /// @chainable Object.prototype
///
/// /// @chainable One, Two
///
/// /// @chainable
/// /// One,
/// /// Two
///
/// /// @chainable
/// /// One
/// /// Two

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
