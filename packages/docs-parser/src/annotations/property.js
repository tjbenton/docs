import { regex, list } from './annotation-utils'
import { to } from '../utils'

/// @name @property
/// @page annotations
/// @description A property from the documented object/array
/// @note Description runs through markdown
/// @returns {object}
/// @markup Usage
/// /// @property {type} name
/// /// @property {type, othertype} name
/// /// @property {type} name - description
/// /// @property {type} name description
/// /// @property {type} name [key list] - description
export default {
  alias: [ 'prop', 'key' ],
  parse() {
    let { contents } = this.annotation
    let [
      types = [],
      name = '',
      value = '',
      description = '',
    ] = regex('property', contents.shift() || '')

    return [
      {
        types: list(types),
        name,
        value,
        description: to.markdown(description, contents)
      }
    ]
  }
}
