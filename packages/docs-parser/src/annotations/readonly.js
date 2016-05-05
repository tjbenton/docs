import { toBoolean } from './annotation-utils'

/// @name @readonly
/// @page annotations
/// @description
/// To note that a property is readonly.
/// @returns {boolean}
///
/// @note {5} If `@readonly` is present without any arguments it will return `true`
///
/// @markup Usage
/// /// @readonly
///
/// /// @readonly true
///
/// /// @readonly false
export default {
  parse() {
    let bool = toBoolean(this.annotation.contents)

    if (bool !== undefined) {
      return bool
    }

    return true
  }
}
