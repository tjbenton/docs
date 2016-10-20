import { toBoolean } from '../utils'

/// @name @async
/// @page annotations
/// @description Used to notate that a function is async
/// @returns {boolean}
/// @markup Usage
/// // this will return true
/// /// @async
///
/// /// @async true
///
/// /// @async false
export default {
  alias: [ 'promise' ],
  parse() {
    const bool = toBoolean(this.annotation.contents)
    return bool !== undefined ? bool : true
  }
}
