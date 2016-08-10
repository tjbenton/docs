export default function sort(list, extras = []) {
  const current_items = []
  list = list.map((str) => {
    let [ name, operator = '<=', amount = '3' ] = str.match(/([a-z-]+)([><=]*)?([\-0-9]*)?/i).slice(1)
    current_items.push(name)
    return [ name, operator, parseInt(amount) ]
  })
  // if the item doesn't currently exist then push add it to the list
  extras.forEach((extra) => current_items.indexOf(extra) < 0 && list.push([ extra, '<=', 3 ]))
  return list
    // get the sort criteria
    .map(([ name, operator, amount ]) => {
      // obj is [ name, operator, amount ]
      if (amount < 0) {
        amount += list.length
      }
      if (operator === '>') {
        amount += 1
      } else if (operator === '<') {
        amount -= 1
      }

      return [ name, amount ]
    })
    // sort the array by the criteria
    .sort((a, b) => {
      a = a[1]
      b = b[1]
      if (a > b) return 1
      if (a === b) return 0
      return -1
    })
    // return just the name that was passed
    .map((obj) => obj[0])
}
