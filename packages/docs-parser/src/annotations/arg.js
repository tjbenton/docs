import { regex, list } from './annotation-utils'
import { to } from '../utils'

/// @name @arg
/// @page annotations
/// @description Parameters from the documented function/mixin
/// @note Description runs through markdown
/// @returns {object}
/// @markup Usage
/// /// @param {type} name
/// /// @param {type, othertype} name
/// /// @param {type} name - description
/// /// @param {type} name description
/// /// @param {type} name [default value] - description
export default {
  alias: [ 'argument', 'param', 'parameter' ],
  parse() {
    let { contents } = this.annotation
    let [
      types = [],
      name = '',
      value = '',
      description = '',
    ] = regex('arg', contents.shift() || '')

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
