import to from './to'
import is from './is'
import promisify from 'es6-promisify'
import path from 'path'
import { map, filter } from 'async-array-methods'

// can't use `import` from es6 because it
// returns an error saying "glob" is read only
const rawGlob = promisify(require('glob'))


/// @description
/// This is a better version of glob. It is built as a generator
/// that has the ability to ignore files. As well as the ability to run
/// a callback filter on the matched files. The callback can be async as well.
///
/// @arg {string, array} files - Glob patterns to get
/// @arg {string, array} ignore [[]] - Glob patterns to ignore
/// @arg {function, boolean} filter - Filter to run on the files
/// @arg {boolean} files_only [true] - Only return file paths
export default async function glob(files, ignore = [], callback, files_only = true) {
  files = map(to.array(files), (file) => rawGlob(file))
  ignore = map(to.array(ignore), (file) => rawGlob(file.replace(/!/, '')))

  files = to.flatten(await files)
  ignore = to.flatten(await ignore)

  // removed any files that are supposed to be ignored
  if (ignore.length) {
    files = files.filter((file) => {
      for (var i in ignore) {
        if (ignore.hasOwnProperty(i)) {
          if (file.indexOf(ignore[i]) > -1) {
            return false
            break
          }
        }
      }

      return true
    })
  }

  if (files_only) {
    files = files.filter((file) => path.extname(file).indexOf('.') > -1)
  }

  if (is.fn(callback)) {
    if (is.promise(callback())) {
      return await filter(files, callback)
    }

    return files.filter(callback)
  }

  return files
}
