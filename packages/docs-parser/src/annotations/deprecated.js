import { regex } from './annotation-utils'
import { to } from '../utils'
/// @name @deprecated
/// @page annotations
/// @description Lets you know that a mixin/function has been depricated
/// @returns {object}
/// @markup Usage
/// /// @deprecated
///
/// /// @deprecated description
///
/// /// @deprecated {version} - description
///
/// /// @deprecated {version} description
///
/// /// @deprecated {version}
/// description
///
/// /// @deprecated {version} description
/// /// more of the description
export default {
  parse() {
    let { contents } = this
    let [ version = '0', description = '' ] = regex('deprecated', contents.shift() || '')
    return {
      version,
      description: to.markdown(description, contents)
    }
  }
}
