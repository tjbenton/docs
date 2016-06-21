/* eslint-disable no-unused-vars*/
const value = 3

/// @name one
/// @type {object}
const foo = {
  value: 1, ///# @property
}

/// @name two
/// @type {object}
const bar = {
  value: 2, ///# @property {number} bar.value
}

/// @name three
/// @type {object}
const baz = {
  value, ///# @property {number, array} baz.value
}

/// @name four
/// @type {object}
const qux = {
  value() { ///# @property {function} qux.value - description
    return 'whatup'
  },
}

/// @name five
/// @type {object}
const corge = {
  value: 5, ///# @property {number} corge.value [5] - Lorem ipsum dolor sit amet, consectetur adipisicing elit
}


/// @name five
/// @type {object}
const grault = {
  ///# @property {function} quux.value ['whatup'] - Lorem ipsum dolor sit amet, consectetur adipisicing elit
  value() {
    return 'whatup'
  },
}
