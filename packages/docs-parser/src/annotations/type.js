import { regex, logAnnotationError } from './annotation-utils'
import { to } from '../utils'
import clor from 'clor'

/// @name @type
/// @page annotations
/// @description Describes the type of a variable
/// @returns {object}
/// @markup Usage
/// /// @type {type}
///
/// /// @type {type} description
///
/// /// @type {type} - description
///
/// /// @type {type}
/// /// multi
/// /// line
/// /// description
export default {
  parse() {
    let { contents } = this.annotation
    let [ type, description = '' ] = regex('type', contents.shift() || '')

    if (!type) {
      this.log.emit(
        'warning',
        `You didn't pass in a type to ${clor.bold('@type')}`,
        logAnnotationError(this, `@type {type}${description ? ' - ' + description : ''}`)
      )
      type = 'undefined'
    }

    return {
      type,
      description: to.markdown(description, contents)
    }
  }
}
