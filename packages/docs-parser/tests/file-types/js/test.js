////
/// @author Tyler Benton
/// @page tests/js
////

let annotations = {}

/// @name @author
/// @alias @authors
/// @description Author of the documented item
/// @returns {string}
/// @markup Usage
/// /// @author Author's name
///
/// /// @author Author One, Author Two
///
/// /// @author Author One
/// /// @author Author Two
annotations.author = {
  alias: [ 'authors' ],
  parse() {
    return multiple(this.annotation)
  }
}


export default annotations
