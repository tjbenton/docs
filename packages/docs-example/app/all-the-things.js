/* eslint-disable */
////
/// @name All the things
/// @page all-the-things
/// @description This is a example of all the annotations
////


/// @access public
/// @name First Comment Block
/// @alias foo, bar
/// @arg {type} name-of-variable [default value] - Lorem ipsum dolor sit amet, consectetur adipisicing elit
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
/// dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
/// ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
/// eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
/// deserunt mollit anim id est laborum.
/// @author Tyler Benton
/// @chainable One, Two
/// @deprecated {^0.0.1}
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis maiores veritatis,
/// sed repellat voluptatibus, eaque nihil assumenda odit at, ea consequatur provident
/// accusamus fugit magnam et adipisci eum, saepe incidunt.
/// @description
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit.
/// Accusantium vel, eveniet, architecto saepe, modi dolore incidunt
/// quisquam eaque cum porro explicabo velit sunt illo praesentium
/// facere. Sit consequuntur illo nihil.
/// @note {5} Lorem ipsum dolor sit amet
/// @note {5} Lorem ipsum dolor sit amet
/// @property {type} key.name - description
/// @readonly false
/// @requires {function} path - the path function from node
/// @returns {object} - This super awesome object
/// ```js
/// {
///   i: {
///     found: {
///       waldo: 'Shoot, you found me'
///     }
///   }
/// }
/// ```
/// @since {^0.0.1}
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis maiores veritatis,
/// sed repellat voluptatibus, eaque nihil assumenda odit at, ea consequatur provident
/// accusamus fugit magnam et adipisci eum, saepe incidunt.
/// @state {:hover}
/// @state {:disabled}
/// @markup {html}
/// <div class="something-super-awesome ${@state}">
///   Mind blown
/// </div>
///
/// @state {:hover} Lorem ipsum dolor sit amet, consectetur adipisicing elit.
/// @markup {html}
/// <div class="something-super-awesome ${@state}">
///   ${@state.description}
/// </div>
///
/// @markup {html} No states
/// <div>This is just an example without any states</div>
/// @throws {fileNotFound} Lorem ipsum dolor sit amet, consectetur adipisicing elit.
/// @todo {10} [Assignee One, Assignee Two] Lorem ipsum dolor sit amet, consectetur adipisicing elit.
/// @type {array} - Lorem ipsum dolor sit amet, consectetur adipisicing elit.
/// @version {^0.0.1} - Lorem ipsum dolor sit amet, consectetur adipisicing elit.
/// @raw-code
export async function findFiles(folders) {
  const files = []
  const sort = (list) => {
    const to_search = []
    list = to.flatten(list)
    for (let item of list) {
      if (!!path.extname(item)) {
        files.push(item)
      } else {
        to_search.push(item)
      }
    }
    return to_search
  }
  const find = async (_folders) => {
    _folders = sort(await map(_folders, (folder) => globby(path.join(folder, '*'))))
    if (_folders.length) {
      return find(_folders)
    }
  }

  await find(to.array(folders))
  return files
}


/// @name Second Comment Block
/// @page all-the-things
/// @access private
/// @description Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed.
