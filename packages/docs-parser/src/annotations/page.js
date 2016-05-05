import { list } from './annotation-utils'

/// @name @page
/// @page annotations
/// @alias @group
/// @description The page you want the documented item to be on
/// @note {5}
/// If a header comment exists in a file without a `@page` annotation
/// it will be auto filled to other.
///
/// @note {10}
/// The `@page` attribute is one of the most important annotations because
/// it is what determines where your documentation for each file or block will go
/// in the documentation site. If you fail to have a header comment, and don't add
/// a `@page` annotation to your body comment then that documentation block will
/// be ignored if `options.raw` is `false`
///
/// @notes {10}
/// #### Usage
///  - If you specify a `@page` annotation in the header comment, all the body blocks on the page
/// will also be added to that page.
///  - If you want all the documentation for a specific file to be in multiple locations you can add
///    multiple pages to the header comment
///  - If you want a specific body comment block to go to a page you can just add a `@page` annotation,
///    and it will get added to the page specified in the header comment and the page that's specified
///    in the body comment block
///
/// @returns {array}
///
/// @markup Usage
/// ////
/// /// @page path
/// ////
///
/// /// @page path
///
/// /// @page add-block/to/location 1
/// /// @page also/add-block/to/location 2
///
/// /// @page add-block/to/location 1, also/add-block/to/location 2
import { to } from '../utils'
export default {
  alias: [ 'group' ],
  parse() {
    return list(this.annotation.contents[0] || '')
  },
  autofill() {
    // autofill header comments
    if (this.comment.type === 'header') {
      return [ this.options.page_fallback ]
    }
    // don't autofill body comments
    return
  }
}
