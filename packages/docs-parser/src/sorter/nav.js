import to, { is } from 'to-js'

/// @name nav
/// @description
/// This function builds the navigation based of how the pages were built.
export default function nav(pages) {
  let result = []

  // loop over the pages structure to create the navigation
  for (let [ key, value ] of to.entries(pages)) {
    result.push(set({
      title: to.titleCase(to.sentenceCase(key)),
      href: `/${key}`,
      body: bodyNames(`/${key}`, value.page.body),
      subpages: []
    }, value))
  }

  return result
}

/// @name bodyNames
/// @description Helper function to get the name of each block in the body
/// @arg {string} href - the href to append the `name` of the block to
/// @arg {array} obj - the body of the page
/// @returns {array}
function bodyNames(href, body) {
  const items = []
  // loop over each block in the body
  for (let block of body) {
    // a) Add the name to the bodyNames
    if (is.existy(block.name)) {
      const item = {
        title: block.name,
        href: `${href}/#${to.paramCase(block.name)}`,
        inline: [],
        blockinfo: block.blockinfo
      }

      if (block.inline && block.inline.length) {
        for (let inline of block.inline) {
          if (is.existy(inline.name)) {
            item.inline.push({
              title: inline.name,
              href: `${item.href}-${to.paramCase(inline.name)}`,
              blockinfo: inline.blockinfo
            })
          }
        }
      }

      items.push(item)
    }
  }

  return items
}


/// @name set
/// @description
/// This is a helper function that recursivly goes through the
/// structure(`a`) creating the navigation structure for
/// the passed item.
/// @arg {object} - This is the top level object to continue to drill down.
/// @arg {object} - The inner structure to continue to loop over.
/// @returns {object}
function set(a, b) {
  for (let [ key, value ] of to.entries(b)) {
    if (key !== 'page') {
      let nav_item = {
        title: is.truthy(value.page.header.name) ? value.page.header.name : to.titleCase(to.sentenceCase(key)),
        href: `${a.href}/${key}`,
        body: [],
        subpages: []
      }

      // add the name of each block in the body
      nav_item.body = bodyNames(nav_item.href, value.page.body)

      // a) Call `set` again because it's not the last level
      if (to.keys(value).length > 1) { // the reason it's `> 1` is because `page` will always be defined.
        nav_item = set(nav_item, value)
      }

      a.subpages.push(nav_item)
    }
  }

  return a
}
