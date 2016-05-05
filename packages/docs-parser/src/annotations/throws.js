import { regex, list } from './annotation-utils'
import { to } from '../utils'
/// @name @throws
/// @page annotations
/// @alias @throw, @exception, @error, @catch
/// @description
/// The error that happends if something goes wrong
/// @returns {hashmap}
/// @markup Usage
/// /// @throws {type}
///
/// /// @throws description
///
/// /// @throws {type} - description
///
/// /// @throws {type} description
///
/// /// @throws
/// /// multi
/// /// line
/// /// description
export default {
  alias: [ 'throw', 'exception', 'error', 'catch' ],
  parse() {
    let { contents } = this.annotation
    let [ types, description = '' ] = regex('throws', contents.shift() || '')

    return [
      {
        types: list(types),
        description: to.markdown(description, contents)
      }
    ]
  }
}
