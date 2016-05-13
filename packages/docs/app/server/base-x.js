var base_x = {}
var dictionaries = {}

/// @name Encode
/// @description Takes a large number and converts it to a shorter encoded string style string i.e. 1TigYx
/// @arg {number} input The number to be encoded to a string
/// @arg {number, string} dictionary ['DICTIONARY_52'] - The dictionary to use for the encoding
/// @arg {number} padding [0] - The padding (minimum length of the generated string)
base_x.encode = function encode(input, padding, dictionary) {
  var result = []
  dictionary = base_x.getDictionary(dictionary)
  var base = dictionary.length
  var exponent = 1
  var remaining = parseInt(input)
  var a, b, c, d
  a = b = c = d = 0
  padding = padding || 0
  // check if padding is being used
  if (padding) {
    remaining += Math.pow(base, padding)
  }
  // generate the encoded string
  while (true) {
    a = Math.pow(base, exponent) // 16^1 = 16
    b = remaining % a // 119 % 16 = 7 | 112 % 256 = 112
    c = Math.pow(base, exponent - 1)
    d = b / c
    result.push(dictionary[parseInt(d)])
    remaining -= b // 119 - 7 = 112 | 112 - 112 = 0
    if (remaining === 0) {
      break
    }
    exponent++
  }

  return result.reverse().join('')
}


/// @name Encode
/// @description Decodes a shortened encoded string back into a number
/// @arg {number} input - The encoded string to be decoded
/// @arg {number, string} dictionary ['DICTIONARY_52'] - The dictionary to use for the encoding
/// @arg {number} padding [0] - The padding (minimum length of the generated string) to use
base_x.decode = function decode(input, padding, dictionary) {
  var chars = input.split('').reverse()
  dictionary = base_x.getDictionary(dictionary)
  var base = dictionary.length
  var result = 0
  var map = {}
  var exponent = 0
  padding = padding || 0

  // create a map lookup
  for (var m = 0; m < base; m++) {
    map[dictionary[m]] = m
  }

  // generate the number
  for (var n = 0; n < input.length; n++) {
    result += Math.pow(base, exponent) * map[chars[n]]
    exponent++
  }

  // check if padding is being used
  if (padding) {
    result -= Math.pow(base, padding)
  }

  return result
}

/// @name getDictionary
/// @description Gets a dictionary or returns the default dictionary of 'DICTIONARY_52'
/// @arg {number, string} dictionary ['DICTIONARY_52'] - The dictionary to get
/// @returns {array}
base_x.getDictionary = function getDictionary(dictionary) {
  return dictionaries[dictionary] || dictionaries['DICTIONARY_' + dictionary] || dictionaries.DICTIONARY_52
}

/// @name addDictionaries
/// @description Adds a new dictionary
/// @arg {string} name - The name of the dictionary to add
/// @arg {string, array} dictionary - The dictionary to use as an array of characters
base_x.addDictionary = function addDictionary(name, dictionary) {
  if (typeof dictionary === 'string') {
    dictionary = dictionary.split('')
  }
  dictionaries[name] = dictionary
  return
}

var numbers = '0123456789'
var lower = 'abcdefghijklmnopqrstuvwxyz'
var upper = lower.toUpperCase()

// add default dictionarys
// numbers and A-F only
base_x.addDictionary('DICTIONARY_16',
  numbers + upper.slice(0, 7)
)
// numbers and uppercase letters A-Z
base_x.addDictionary('DICTIONARY_32',
  (numbers + upper).replace(/[0ilo]/gi, '')
)

base_x.addDictionary('letters', upper + lower)

// numbers, uppercase and lowercase B-Z minus vowels
base_x.addDictionary('DICTIONARY_52',
  (numbers + upper).replace(/[aeiou]/gi, '')
)
// numbers, uppercase and lowercase A-Z
base_x.addDictionary('DICTIONARY_62',
  numbers + upper + lower
)
// numbers, uppercase and lowercase A-Z and ~!@#$%^& (minus 0,o,O,1,i,I,l,L useful to generate passwords)
base_x.addDictionary('DICTIONARY_PASS',
  (numbers + upper + lower + '~!@#$%^&').replace(/[01oil]/gi, '')
)
// numbers, uppercase and lowercase A-Z and ~!@#$%^& (useful to generate passwords)
base_x.addDictionary('DICTIONARY_70',
  numbers + upper + lower + '~!@#$%^&'
)
// numbers, uppercase and lowercase A-Z and +"~!@#$%&*/|()=?'[]{}-_:.,;
base_x.addDictionary('DICTIONARY_89',
  numbers + upper + lower + '+"@*#%&/|()=?~[]{}$-_.:,;<>'
)

import crypto from 'crypto'

base_x.encodeString = function encodeString(data, padding = 4, dictionary = 'letters') {
  let hash = crypto
    .createHash('md5')
    .update(JSON.stringify(data), 'utf8')
    .digest('hex')
    .split('')
    .reduce((prev, next) => prev + next.charCodeAt(), 0)
  return base_x.encode(hash, padding, dictionary)
}


export default base_x
