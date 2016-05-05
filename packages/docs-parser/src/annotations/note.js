import { regex } from './annotation-utils'
import { to } from '../utils'
/// @name @note
/// @page annotations
/// @alias @notes
/// @description A note about the documented item
/// @returns {object}
///
/// @markup Usage
/// /// @note description
///
/// /// @note {importance} description
///
/// /// @note {importance}
/// /// multi
/// /// line
/// /// description
export default {
  alias: [ 'notes' ],
  parse() {
    let { contents } = this.annotation
    let line = contents.shift()
    let [ importance = '0', description = '' ] = regex('note', line || '')

    return [
      {
        importance,
        description: to.markdown(description, contents)
      }
    ]
  }
}
