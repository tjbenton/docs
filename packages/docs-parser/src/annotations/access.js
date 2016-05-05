/// @name @access
/// @page annotations
/// @arg {string} line [public] - public, private, protected
/// @description
/// Access of the documented item. If access isn't declared then it defaults to public.
/// @markup Usage
/// /// @access public
///
/// /// @access private
///
/// /// @access protected
/// @note This is autofilled on every comment block
export default {
  autofill() {
    let access = 'public'
    try {
      if (this.comment.type === 'inline') {
        access = this.parent.parsed.access
      }
    } catch (e) {
       // do nothing
    }
    return access
  },
  parse() {
    const line = `${this.annotation.contents[0]}`
    if (
      line === 'private' ||
      line === 'protected'
    ) {
      return line
    }

    return 'public'
  }
}
