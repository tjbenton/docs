import to, { is } from 'to-js'
import { logAnnotationError } from './annotation-utils'
import path from 'path'
/// @name blockinfo
/// @page annotations
/// @description
/// This annotation is a special one in that it's only autofilled, and it adds
/// information about the current block
///
/// Here's an example of the information that it returns
///
/// ```
/// "blockinfo": {
///   "comment": {
///     "start": 1,
///     "end": 3,
///     "type": "header"
///   },
///   "code": {
///     "start": -1,
///     "end": -1
///   },
///   "file": {
///     "path": "docs/tests/annotations/access/access.header.js",
///     "start": 1,
///     "end": 4
///   }
/// }
/// ```
export default {
  autofill() {
    let obj = to.clone(this)
    let comment = obj.comment
    delete comment.contents

    let code = obj.code
    delete code.contents

    const file_filter = [ 'contents', 'name', 'type', 'comment', 'options' ]
    let file = to.filter(obj.file, ({ key }) => !is.in(file_filter, key))
    // this ensures that the path that's displayed is always relative
    file.path = path.normalize(file.path)
    if (path.isAbsolute(file.path)) {
      file.path = file.path.replace(process.env.PWD.split(path.sep).slice(0, -1).join(path.sep) + path.sep, '')
    }

    return { comment, code, file }
  },
  parse() {
    this.log.emit('warning', "Passed @blockinfo, it's only supposed to be an autofilled annotation", logAnnotationError(this, ''))
    return
  }
}
