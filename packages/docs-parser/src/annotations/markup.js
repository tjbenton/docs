import { is, to } from '../utils'
import { regex, list, escape } from './annotation-utils'
/// @name @markup
/// @page annotations
/// @alias @code, @example, @output, @outputs
/// @description
/// Example code on how to use the documented block.
///
///  - `id` is a way for a `@state` annotation to specify which `@markup` annotation it's state(s) should be applied to.
///  - `language` The language you're documenting. It defaults to the current file extention
///  - `settings` Settings that are passed to the code block
///  - `description` A short description of the documented item that is parsed in markdown
///
/// @note Description is parsed as markdown
/// @returns {object}
/// ```js
/// {
///   id: 'string', // id of the markup block, it defaults to '0'
///   language: 'string', // language of the block, defaults to
///   settings: {}, // settings for the code block
///   description: 'string',
///   raw: 'string', // raw string of code
///   raw_stateless: 'string', // same as the raw string but without `@state` references
///   escaped: 'string', // escaped code, aka `<span>` turns to `&lt;span&gt;`
///   escaped_stateless: 'string', // same as the escaped string but without `@state` references
/// }
/// ```
/// @markup Usage
/// /// @markup
/// /// code
///
/// /// @markup (id)
/// /// code
///
/// /// @markup {language}
/// /// code
///
/// /// @markup [settings]
/// /// code
///
/// /// @markup description
/// /// code
///
/// /// @markup (id) {language} [settings] - description
/// /// code
///
/// /// @markup (id) {language} [settings] description
/// /// code
export default {
  alias: [ 'code', 'example', 'output', 'outputs' ],
  parse() {
    let { contents } = this
    let [
      id = null,
      language = this.file.type,
      settings = {},
      description
    ] = regex('markup', contents.shift() || '')

    let raw = to.string(contents)
    let escaped = escape(raw)
    let state_interpolation

    {
      const { interpolation, prefix } = this.options.language
      const { start, end } = interpolation

      state_interpolation = `${start}${prefix}states?[^${end}]*${end}`
    }

    state_interpolation = new RegExp(`\\s*${state_interpolation}\\s*`, 'gi')
    let raw_stateless = raw.replace(state_interpolation, '')
    let escaped_stateless = escaped.replace(state_interpolation, '')

    if (is.string(settings)) {
      settings = to.object(list(settings).map((setting) => setting.split('=')))
    }


    let result = {
      id,
      language,
      settings,
      description: to.markdown(description),
      raw,
      escaped,
      raw_stateless,
      escaped_stateless,
    }

    return [ result ]
  },
  resolve() {
    return to.map(this, (obj, i) => {
      if (obj.id === null) {
        obj.id = `${i}`
      }
      return obj
    })
  }
}
