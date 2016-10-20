import to from 'to-js'
import naturalSort from 'natural-sort'
/// @name sort
/// @page parser/sort
/// @description This function is used to sort a list by `<>=[0-9]`
/// @arg {array} list - List to sort
/// @arg {object, array, string, number} options
/// ```
/// {
///   extras: [], // if options is a `array` it refers to `extras`
///   operator: '=', // if options is a `string` it refers to `operator`
///   amount: 0, // if options is a `number` it refers to `amount`
/// }
/// ```
/// @returns {array} of sorted items
export default function sort(list, options = {}) {
  const type = to.type(options)
  if (type === 'array') {
    options = { extras: options }
  } else if (type === 'string') {
    options = { operator: options }
  } else if (type === 'number') {
    options = { amount: options }
  }

  options = Object.assign({
    extras: [],
    operator: '=',
    amount: 0
  }, options)

  const existing = []
  return list
    .concat(options.extras)
    // .reverse()
    .map((str) => {
      let [ name, operator = options.operator, amount = options.amount ] = str.match(/([a-z-]+)([><=]*)?([\-0-9]*)?/i).slice(1)
      if (existing.includes(name)) {
        return false
      }
      existing.push(name)
      return { name, operator, amount: parseInt(amount) }
    })
    .filter(Boolean)
    // get the sort criteria
    .map(({ name, operator, amount }) => {
      if (amount < 0) {
        amount += list.length
      }
      if (operator === '>') {
        amount += 1
      } else if (operator === '<') {
        amount -= 1
      }
      return `${amount}@@@@@${name}`
    })
    .sort(naturalSort())
    .map((obj) => obj.split('@@@@@')[1])
}
