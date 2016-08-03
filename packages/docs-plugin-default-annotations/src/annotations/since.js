import { regex } from '../utils'
import to from 'to-js'
/// @name @since
/// @page annotations
/// @description Let's you know what version of the project a something was added
/// @returns {string}
/// @markup Usage
/// /// @since {version}
///
/// /// @since {version} - description
///
/// /// @since {version} description
///
/// /// @since {version}
/// /// multi
/// /// line
/// /// description
export default {
  parse() {
    let { contents } = this.annotation
    let [ version = 'undefined', description = '' ] = regex('since', contents.shift() || '')

    return {
      version,
      description: to.markdown(description, contents)
    }
  }
}
