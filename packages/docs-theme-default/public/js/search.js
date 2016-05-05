import lunr from 'lunr'
import $ from 'cash'
import search_index from '../search_index.js'

const $search = $('.docs-js-search')

const index = lunr.Index.load(search_index)

window.searchIndex = index


const getResults = debounce((e) => {
  const obj = e.target
  const value = obj.value
  console.log(value)
})

$search.on('keypress', '.docs-js-search__input', getResults)


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait = 250, immediate) {
  let timeout
  return function DebouncedFunc() {
    let self = this
    let args = arguments
    let later = () => {
      timeout = null
      if (!immediate) func.apply(self, args)
    }
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(self, args)
  }
}
