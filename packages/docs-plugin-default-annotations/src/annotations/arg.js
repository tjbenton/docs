import { regex, list } from '../utils'
import to from 'to-js'

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
  },
  render(params) {
    params = params.map(({ types, name, value, description }) => {
      types = types.map((type) => `<code>${type}</code>`).join(', ')
      return `
        <tr>
          <td class="c-arg__name">${name}</td>
          <td class="c-arg__value">${value}</td>
          <td class="c-arg__types">${types}</td>
          <td class="c-arg__description">${description}</td>
        </tr>
      `
    }).join('\n')
    return `<table class="c-annotation c-arg">${params}</table>`
  }
}
