/// @name @name
/// @page annotations
/// @alias @title, @heading, @header
/// @description Name of the documented item
/// @returns {string}
///
/// @markup Usage
/// /// @name Name of the documented item
export default {
  alias: [ 'title', 'heading', 'header' ],
  parse() {
    return `${this.annotation.contents[0]}`
  }
}
