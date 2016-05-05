'use strict'
import { is, to } from './utils'

export default class AnnotationApi {
  constructor({ annotations, file, type }) {
    // object of the all the annotation
    // This object holds all the annotations
    this.annotations_list = {
      default: {
      // holds all default annotations for all filetypes that aren't
      // specific to an individual filetype.
      }
      // You can add file specific overrides if you need to. All you have
      // to do is specific the filetype as the key(aka replace default with the filetype)
      // js: {
      //  annotation
      // }
    }

    this.file = file || { type }


    // stores the current annotation that is being added
    // to the annotations list.
    // the name of the annotation is always the key
    this.annotation_base = {
      // this declares where this annotation get's applied
      filetypes: [ 'default' ],

      // holds an array of aliases for the given annotation
      alias: [],

      // This function runs when the parser gets
      // the annotations information
      parse() {
        return this.contents.shift()
      },

      // Runs when the each annotation in the block has been
      // parsed. If the annotation doesn't exist and the autofill
      // is set to be a function then autofill get's called, and
      // the block and file info are accessible within `this` if
      // it is a function.`. **Note** this will not run if the
      // annotation exists
      autofill: false,

      // Runs after the parsed and/or autofill runs the contents
      // of `this` is what was returned by the parse and/or autofill.
      // It's used to fixed data that was returned by parse.
      // It helps when members on your team pass in the wrong keyword(s)
      // and let's you resolve them here in the data instead of resolving
      // the issues on the client side. It's also useful if you want want
      // to ensure the data always returns an `array`.
      resolve: false
    }

    this.annotation_base_keys = to.keys(this.annotation_base)


    this.addAnnotations(annotations)

    this.annotations = to.reduce([ 'alias', 'autofill', 'resolve' ], (previous, current) => {
      return to.extend(previous, {
        [current]: this.list(current)
      })
    }, { parse: this.list() })
  }

  /// @name add
  /// @description
  /// Adds a single annotation to the list
  ///
  /// @arg {string, array} annotation - Name of the annotation
  /// @arg {function, object} parses [annotation_base.callbacks] - Functions
  /// @arg {string} ...alias - the rest of the arguments are alias
  ///
  /// @returns {this}
  ///
  /// @markup {js} **Example:** Declaring a basic annotation
  /// annotationsApi.add("name", function(){
  ///   return this.annotation.line
  /// })
  ///
  /// @markup {js} **Example:** Declaring a annotation with more options
  /// annotationsApi.add("name", {
  ///   alias: ['title', 'heading'],
  ///   parse(){
  ///     return this.annotation.line
  ///   },
  ///   autofill: false,
  ///   resolve: false
  /// })
  ///
  /// @markup {js} **Example** Specifing a file specific annotation
  /// annotationsApi.add('promise', {
  ///   // the filetypes passed will use the `parse` and the other
  ///   // settings in the config. It can be a string or an array of
  ///   // filetypes. Note that if a filetype isn't specificed it defaults
  ///   // to be `'default'` which will apply to all files.
  ///   filetype: ['js', 'jsx', 'es', 'es6', 'es7'],
  ///   parse(){
  ///     return this.annotation.line
  ///   },
  ///   ...
  /// })
  ///
  /// @markup {js} **Example** Specifing a file specific annotation(Option 2)
  /// This is very useful
  /// docs.annotation.add('name', {
  ///   default: { // for all filetypes that aren't defined for this annotation
  ///     parse(){
  ///       return this.annotation.line
  ///     },
  ///     ...
  ///   },
  ///   js: { // use the file extention
  ///     parse() {
  ///       return `JS ${this.annotation.line}`
  ///     },
  ///     ...
  ///   }
  /// })
  add(name, config) {
    let initial_config = config
    let result = to.clone(this.annotation_base)
    // a) throw an error
    if (!is.string(name)) {
      throw new Error('name must be a string')
      return
    }

    // a) set the passed `array` as the `alias`
    // b) set the passed `function` as the `parse` function
    // c) it's a filetype specific `object`
    // d) throw an error
    if (is.array(config)) {
      config = { alias: config }
    } else if (is.fn(config)) {
      config = { parse: config }
    } else if (
      is.plainObject(config) &&
      !is.empty(config) &&
      !is.any.in(config, ...this.annotation_base_keys)
    ) {
      // loop through each filetype in the passed
      // object and rerun the add function
      for (let filetype in config) {
        if (config.hasOwnProperty(filetype)) {
          let obj = config[filetype]
          obj.filetypes = is.in(obj, 'filetype') ? to.flatten([ filetype, config.filetype ]) : to.array(filetype)
          this.add(name, obj)
        }
      }
      return
    } else if (!is.plainObject(config)) {
      throw new Error('config must be a function or object and you passed')
      this.log.error(initial_config)
      return
    }

    // merge the passed `config` with the base config
    // to ensure all settings are defined.
    to.merge(result, config)

    // merge the passed annotation with the
    // global list of annotations by filetype/default
    for (let filetype of result.filetypes) {
      to.merge(this.annotations_list, {
        [filetype]: { [name]: result }
      })
    }

    return this
  }

  addAnnotations(annotations) {
    for (let name in annotations) {
      if (annotations.hasOwnProperty(name)) {
        this.add(name, annotations[name])
      }
    }
  }

  /// @name list
  /// @description
  /// This gets the annotations to use for the current filetype.
  /// Basically the file specific annotations get extended onto the default annotations
  /// @returns {object} - the annotations to use for the current file
  list(type) {
    let result = this.annotations_list.default
    if (!is.undefined(this.annotations_list[this.file.type])) {
      result = to.extend(to.clone(result), this.annotations_list[this.file.type])
    }

    if (is.undefined(type)) {
      return result
    }

    return to.map(result, ({ key: name, value: annotation }) => {
      if (is.truthy(annotation[type]) && !is.empty(annotation[type])) {
        return { [name]: annotation[type] }
      }

      return false
    })
  }

  run(type, ...options) {
    {
      const base = { contents: [], start: -1, end: -1 }
      options = to.arguments({
        annotation: { name: '', alias: '', ...base },
        file: { path: '', name: '', type: '', ...base },
        comment: { ...base },
        code: { ...base },
      }, ...options)
    }

    // /// @name add
    // /// @page annotation
    // /// @description Allows you to add a different annotation from within a annotation
    // /// @arg {string} name - the name of the annotation you want to add
    // /// @arg {string} str - information that is passed to the annotation
    // const add = (name, contents) => {
    //   contents = to.normalize(contents)
    //   return this.run({
    //     annotation: {
    //       name,
    //       alias: is.in(this.annotations.alias, name) ? this.annotations.alias[name] : [],
    //       line: to.normalize(contents[0]),
    //       contents,
    //       start: null,
    //       end: null
    //     },
    //     annotation_types,
    //     ...block,
    //     log
    //   })
    // }

    {
      const list = this.annotations_list
      const { annotation, file } = options
      const fn = (list[file.type] || {})[annotation.name]
      let default_fn = (list.default || {})[annotation.name]

      if (fn && default_fn && (default_fn = default_fn[type])) {
        options.default = () => default_fn.call(options)
      }
    }

    let details = options

    try {
      const fn = this.getAnnotationFn(options.annotation.name, type)

      if (type === 'parse') {
        details = copyInvisible(options.annotation, options)
      } else if (type === 'resolve') {
        details = copyInvisible(options.parsed[options.annotation.name], options)
      }


      let result = is.function(fn) ? fn.call(details) : fn

      if (type === 'parse' && !is.any.undefined(details, result)) {
        // copy the details that were used to call the parse function command onto the result
        // as `details` this gives the resolve function the ability to access all of the information if needed
        if (is.array(result) && result.length === 1) {
          result = to.map(result, (obj) => copyInvisible(obj, { details }))
        }

        result = copyInvisible(result, { details })
      }

      return result
    } catch (e) {
      throw new Error(e)
    }


    function copyInvisible(obj, value) {
      let _type = to.type(obj)

      switch (_type) {
        case 'array':
        case 'object':
          break
        default:
          let types = { String, Number, Boolean }
          let Type = types[_type.charAt(0).toUpperCase() + _type.slice(1)]
          obj = new Type(obj)
      }

      // loop over the data and set them to be getters on the
      // passed object. This makes them available but they don't show
      // up in the console and clutter up all the things
      for (var item in value) {
        if (value.hasOwnProperty(item)) {
          Object.defineProperty(obj, item, { value: value[item] })
        }
      }

      // set the prototype to the the passed data
      Object.defineProperty(obj, 'prototype', { value })
      return obj
    }
  }

  getAnnotationFn(name, type) {
    let fn = this.annotations
    fn = fn[type] || {}
    fn = fn[name] || {}
    if (is.function(fn)) {
      return fn
    }
    fn = fn[type] || {}
    return fn
  }

  alias_check() {
    for (let i in this.annotation_names) {
      if (this.annotation_names.hasOwnProperty(i)) {
        let name = this.annotation_names[i]
        if (is.in(this.annotation_aliases, name)) {
          throw new Error(`${name} is already declared as an annotation`)
          return
        }
      }
    }
  }
}
