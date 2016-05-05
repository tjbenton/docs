import { regex, list } from './annotation-utils'
import { to } from '../utils'

/// @name @todo
/// @page annotations
/// @description Things to do related to the documented item
/// @returns {object}
/// // todo - {5} [assignee-one, assignee-two] - Task to be done
/// @mrkup Usage
/// /// @todo description
///
/// /// @todo {importance} - description
///
/// /// @todo {importance} [assignee[, assignee]] - description
///
/// /// @todo {importance} [assignee[, assignee]] description
///
/// /// @todo {importance} [assignee[, assignee]]
/// /// multi
/// /// line
/// /// description
export default {
  parse() {
    let { contents } = this.annotation
    let [
      importance = '0',
      assignees,
      description = ''
    ] = regex('todo', contents.shift() || '')

    return [
      {
        importance,
        assignees: list(assignees),
        description: to.markdown(description, contents)
      }
    ]
  },
  resolve() {
    // come back and add a setting that auto creates a todo page
  }
}
