import { to } from '../utils'

/// @name @markdown
/// @page annotations
/// @filetypes @markdown, @mark, @mdown, @mkdn, @mdtxt, @mkd, @mdml, @mdwn, @mdtext, @text, @md
/// @description
/// This markdown annotation is used to add a markdown files contents to the documentation.
/// It's typically only used in a header comment along with `@page`.
///
/// @note
/// On a side note, I have absolutly no idea why markdown has to many different file types
/// but I think I got all of them but If I missed open an issue or submit a pull request
///
/// @returns {string} The parsed markdown file
///
/// @markup Usage
/// <!----
/// @markdown
/// ---->
export default {
  filetypes: [
    'markdown', 'mark', 'mdown',
    'mkdn', 'mdtxt', 'mkd',
    'mdml', 'mdwn', 'mdtext',
    'text', 'md'
  ],
  parse() {
    const { header, body } = this.options.language
    const start = `(?:${header.start}|${body.start})`.replace('\\', '\\\\')
    const end = `(?:${header.end}|${body.end})`.replace('\\', '\\\\')
    const md_regex = new RegExp(`${start}(?:.|\\n)*\\n${end}`, 'gmi')

    return to.markdown(this.file.contents.replace(md_regex, ''))
  }
}
