import { logAnnotationError, regex } from './annotation-utils'
import { to } from '../utils'
import clor from 'clor'

/// @name @version
/// @page annotations
/// @description Describes the type of a variable
/// @returns {object}
/// @markup Usage
/// /// @version {version}
///
/// /// @version {version} - description
///
/// /// @version {version} description
///
/// /// @version {version}
/// /// multi
/// /// line
/// /// description
export default {
  parse() {
    let { contents } = this.annotation
    let [ version = 'undefined', description = '' ] = regex('version', contents.shift() || '')

    if (version === 'undefined') {
      this.log.emit(
        'warning',
        `You didn't pass in a version to ${clor.bold('@version ')}`,
        logAnnotationError(this, `@version {version}${description ? ' - ' + description : ''}`)
      )
    }

    return {
      version,
      description: to.markdown(description, contents)
    }
  }
}
