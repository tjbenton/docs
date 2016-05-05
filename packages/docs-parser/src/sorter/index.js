import getPages from './pages'
import getNav from './nav'

/// @name sort
/// @description
/// Sorts the parsed data into pages and creates the navigation
/// @arg {object}
/// @returns {object}
export default function sorter(options = {}) {
  const pages = getPages(options)
  const nav = getNav(pages)

  return { nav, pages }
}
