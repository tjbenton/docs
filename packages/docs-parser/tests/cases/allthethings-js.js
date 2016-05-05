////
/// @name All the things test
/// @author Tyler Benton
/// @page components
////


/// @name Beards
/// @description
/// This is an awesome class about beards
class Beards {
  ///# @name constructor
  ///# @arg {object} options
  constructor({ one, two }) {
    // so some shit
  }

  ///# @name beard
  ///# @arg {string} type ['full beard'] - The type of beard you're wanting to get
  beard(type = 'full beard') {
    return this.types[type]
  }
}