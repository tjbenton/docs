/* eslint-disable complexity, max-depth */
import { is, to } from '../utils'
import clor from 'clor'

/// @name pages
/// @description
/// This function loops over the json that was passed and creates a organized structure
/// based on the `@pages` annotations that were passed.
export default function pages(options) {
  return new Pages(options)
}

class Pages {
  constructor({ json, page_fallback, log }) {
    this.json = json
    this.page_fallback = page_fallback
    this.log = log
    this.base = { page: { header: {}, body: [] } }
    this.result = {}

    for (const obj of to.objectEntries(this.json, 'path')) {
      let { path, header, body } = this.obj = obj
      this.path = path
      this.header = header
      to.each({ header, body }, this.parse, this)
    }

    return this.result
  }

  parse({ key, value: val }) {
    if (!is.empty(val)) {
      if (is.array(val)) {
        return to.each(val, (value) => this.parse({ key, value }), this)
      }

      if (!is.empty(val)) {
        this.parseToken({ key, value: val })
      }
    }
  }

  parseToken({ key: token_type, value: token }) {
    let token_title = to.titleCase(token_type)
    const is_header = token_type === 'header'
    const path = this.path

    if (is.falsy(token.page) && is_header) {
      if (is.falsy(this.page_fallback)) {
        this.log.emit('warning', to.normalize(`
          ${token_title} comment ${token.name && '@name ' + token.name} doesn't have a ${clor.bold('@page')} defined in
          ${clor.bold.blue(path)}
        `))
        return
      }

      this.header.page = [ this.page_fallback ]
    }

    let page_list = []
    // if the header doesn't exist or the page is empty
    if (!token.page || is.empty(token.page)) {
      if (this.header.page && !is.empty(this.header.page)) {
        page_list.push(...(this.header.page))
      } else if (!this.header.page || is.empty(this.header.page)) {
        page_list.push(this.page_fallback)
      }
    }

    page_list.push(token.page || '')

    token.page = page_list = to.unique(to.flatten(to.filter(page_list)))

    // If the token doesn't contain a name and isn't a header comment it get's skipped
    if (is.falsy(token.name)) {
      if (!is_header) {
        this.log.emit('warning', to.normalize(`
          The hardest thing in development is naming all the things but you gotta try, add a ${clor.bold('@name')} annotation
          to the comment block starting on line ${token.blockinfo.comment.start} in  ${clor.bold.blue(path)}
        `))
        // return
      }

      // set the token name to be the filepath name
      // let name = path.split('/').pop()
      // token.name = name.split('.')
      // token.name = `${to.titleCase(token.name[0])} ${to.upperCase(token.name[1])} File` // `(<code>${name}</code>)`
    }

    if (is.empty(page_list)) {
      this.log.emit('warning', to.normalize(`
        The documentation starting on line ${token.blockinfo.comment.start} isn't being added because a ${clor.bold('@page')} annotation doesn't exist
        ${clor.bold.blue(path)}
      `))
      return
    }
    for (const page of token.page) this.set(page, token_type, token)
  }

  // @name set
  // @description
  // creates a structure from an array, and adds the passed object to
  // the `base` array if it was passed.
  //
  // @returns {object} - The nested object with the set value
  set(path, type, value) {
    // ensures values won't change in the passed value
    value = to.clone(value)

    // deletes the page from the value so it
    // won't get added to the data
    delete value.page

    let obj = this.result
    // convert to array, and filter out empty strings
    let path_list = path.split('/').filter(Boolean)

    // 1 less than the link so the last item in the `path_list` is what
    // the passed value will be set to
    let length = path_list.length - 1

    // loop over all the pages in in the `path_list` except the
    // last one and create the `page`, and `nav` if they don't exist.
    for (let [ i, page ] of to.entries(path_list, 0, length)) {  // eslint-disable-line
      if (!obj[page]) {
        obj[page] = to.clone(this.base)
      }
      obj = obj[page]
    }

    // a) Define the default data set(can't use `page` because it will be overwritten)
    if (!obj[path_list[length]]) {
      obj[path_list[length]] = to.clone(this.base)
    }

    if (type === 'header') {
      obj[path_list[length]].page.header = to.merge(obj[path_list[length]].page.header, value)
    } else {
      obj[path_list[length]].page.body.push(value)
    }
  }
}
