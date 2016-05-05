import { is, to } from '../utils'
import { regex } from './annotation-utils'

/// @name @states
/// @page annotations
/// @alias @state
/// @description A state of a the documented item
/// @returns {hashmap}
/// @note {10} This annotation must be used with @markup
/// @markup Usage
/// /// @state {state}
/// /// @state {state}
/// /// @state {state}
/// /// @state {state}
///
/// /// @state (id) {state} [state_id] - description
/// /// @state (id) {state} [state_id] - description
/// /// @state (id) {state} [state_id] - description
///
/// /// @state (id)
/// /// {state} - description
/// /// {state} - description
/// /// {state} - description
///
/// /// @states (id)
/// /// {state} [state_id] - description
/// /// {state} [state_id] - description
/// /// {state} [state_id] - description
export default {
  alias: [ 'state' ],
  parse() {
    let { contents } = this
    let [ markup_id = null, state_line ] = regex('state_id', contents.shift())
    let state = to.flatten(state_line, contents).filter(Boolean)

    state = state.reduce((previous, current, i) => {
      let [ state = '', id = `${i}`, description = '' ] = regex('state', current) // eslint-disable-line
      return to.extend(previous, {
        [id]: { state, description: to.markdown(description) }
      })
    }, {})

    return [ { markup_id, state } ]
  },
  resolve() {
    const { parsed, log, file, parent } = this

    const is_inline = this.comment.type === 'inline'
    return this.reduce((previous, current) => { // eslint-disable-line
      let { markup_id, state, details } = current
      let markup = (parsed || {}).markup || !is.empty(parent) && parent.parsed.markup // might need to be cloned
      let start_at = details.annotation.start // gets the starting point of the current state annotation being parsed

      // throw an error because a state should always be accompanied by a `@markup` block
      if (!markup) {
        log.emit('error', `
          You must have a @markdown annotation associated with @state
          ${this.file.path}:${(current.details || {}).start || this.comment.start}
        `)
      } else if (is.falsy(markup_id)) {
        if (is_inline && !parsed.markup) {
          markup = findMarkupById(markup, 'default') || markup[0]
        } else {
          markup = findMarkupAfter(markup, start_at)
        }
        markup_id = (markup || {}).id
        if (!markup) {
          log.emit('error', `
            There's no instance of a '@markup' annotation after line ${start_at}
            in ${file.path}
          `)
        }
      } else {
        markup = findMarkupById(markup, markup_id)
        if (!markup) {
          log.emit('error', `
            There's no instance of a '@markup' annotation with an id of ${markup_id}.
            in ${file.path}
          `)
        }
      }

      // return just the state and a empty markup block
      // because a markup block wasn't found
      if (!markup) {
        return to.merge(previous, {
          [markup_id]: [ { state, markup: {} } ]
        })
      }

      // filter out the `raw_stateless`, and `escaped_stateless` keys because this is
      // a state so it shouldn't have a stateless instance
      markup = to.filter(to.clone(markup), ({ key }) => !is.in(key, 'state'))

      // this allows users to specify interpolations like `@state.description`
      // without affecting the actual state output
      let _state = to.clone(state)
      // this adds the first state to the `_state` object. This allows
      // users to write `@state.description` instead of `@state[0].description`
      to.extend(_state, _state[to.keys(_state)[0]])
      markup.raw = replaceStates.call(this, markup.raw, _state)
      markup.escaped = replaceStates.call(this, markup.escaped, _state)

      return to.merge(previous, {
        [markup_id]: [ { state, markup } ]
      })
    }, {})
  }
}

/* eslint-disable no-invalid-this */
function replaceStates(str, states) {
  let state_interpolation, replacement

  {
    let names = [ this.annotation.name, ...(this.annotation.alias) ].join('|')
    const { interpolation, prefix } = this.options.language
    const { start, end } = interpolation

    state_interpolation = new RegExp(`${start}${prefix}(?:${names})[^${end}]*${end}`, 'g')
    replacement = new RegExp(`${start}${prefix}(?:${names})|${end}`, 'g')
  }

  return str.replace(state_interpolation, (original_match) => {
    let match = original_match.replace(replacement, '').slice(1)

    if (!match) {
      return states.state
    }

    let dot_index = match.indexOf('.')
    let bracket_index = match.indexOf('[')
    let index = dot_index > bracket_index ? dot_index : bracket_index

    if (index > -1) {
      let key = clean(match.slice(0, index))
      let item = clean(match.slice(index))
      return (states[key] || {})[item]
    }

    let result = states[clean(match)]

    if (is.plainObject(result)) {
      return result.state
    }

    return result
  })
}

function clean(str) {
  return str.replace(/[\[\]\.]/g, '')
}

function findMarkupById(markup, id) {
  for (let item of markup) {
    if (item.id === id) {
      return item
    }
  }
  return
}

function findMarkupAfter(markup, start_at) {
  for (let item of markup) {
    if (start_at < item.details.start) {
      return item
    }
  }
  return
}
