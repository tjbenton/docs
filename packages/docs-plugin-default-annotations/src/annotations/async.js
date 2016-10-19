import { toBoolean } from '../utils'

/// @name @async
/// @page annotations
/// @description Used to notate that a function is chainable
/// @returns {boolean}
/// @markup Usage
/// // this will return true
/// /// @chainable
///
/// /// @chainable true
///
/// /// @chainable false
export default {
  parse() {
    return toBoolean(this.annotation.contents) || true
  }
}
