import { list } from '../utils'
/// @name @author
/// @page annotations
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
export default {
  alias: [ 'authors' ],
  parse() {
    return list(this.annotation.contents)
  },
  render(authors) {
    authors = authors.map((author) => `<li class="c-authors__author">${author}</li>`)
    return `<ul class="c-annotation c-authors">${authors}</ul>`
  }
}
