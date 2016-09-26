<p align="center">
  <a href="http://github.com/tjbenton/docs">
    <img alt="Docs" src="https://raw.githubusercontent.com/babel/logo/master/babel.png" width="546">
  </a>
</p>

<p align="center">
  <b><a href="#features">Features</a></b>
  |
  <b><a href="#docsfiles">Docsfiles</a></b>
  |
  <b><a href="#plugins">Plugins</a></b>
  |
  <b><a href="#themes">Themes</a></b>
  |
  <b><a href="#hacking">Hacking</a></b>
  |
  <b><a href="#quickstart">Quickstart</a></b>

</p>

## Features
  - Supports any language that supports comments
  - If a languages comment style isn't defined it can be added very easily
  - Define custom annotations per language, and define defaults for all languages


## Docsfiles

Similar to other libraries, _Docs_ reads a `docsfile.js` (case sensitive) to know what plugins and theme you want to use.

By default fly supports the `babel-preset-latest` for the `docsfile.js`, this means you can write your config file in es5, es6, or es7.


### ES5 Example

```js
module.exports = {
  plugins: [
    'scss', // `docs-plugin-scss` will also work
  ],
  theme: 'default',
}
```


### ES6/ES7 Example

```js
export default {
  plugins: [
    'scss', // `docs-plugin-scss` will also work
  ],
  theme: 'default',
}
```


## Plugins

Plugins are used to add custom annotations to the docs parser

Below are the defaults for every annotation that's added.

```js
{
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
```

### options.filetypes
This declares where this annotation get's applied, to only apply something to a css file you would pass `'css'`.

### options.alias

Holds an array of aliases for the given annotation


### options.parse
**parse** - The function that will parse the data gathered for this annotation if it is present in a comment block.


#### `this`

The `this` object. It can also be accessed under `this.annotation`

```js
{
  // name of the annotation
  name: 'markup',

  // the name of the alias that was used
  alias: '',

  // The contents of the annotation with the first line being the same line that the annotation was on
  contents: [
    '{html}',
    '<div class="c-btn-group">',
    '  <a href="#" class="c-btn ${@state}">Button (a)</a>',
    '  <button class="c-btn ${@state}">Button (button)</button>',
    '  <input class="c-btn ${@state}" type="button" value="Button (input)">',
    '</div>'
  ],
  start: 31,
  end: 36
}
```


#### Each line

Each line in `this.contents` is an object full of information and then it's converted to a string (aka `this.contents.join('\n')`) it joins the `Line.str` value.

```js
Line {
  str: '{html}',
  lineno: 31,
  raw: ' /// @markup {html}',
  indent: 1,
  index: {
    start: false,
    single: 1,
    end: false,
    code: false
  },
  has_comment: true,
  has_code: false,
  has_annotation: true,
  raw_without_comment: '@markup {html}',
  annotation: 'markup',
  raw_annotation: '@markup',
  alias: ''
}
```

A few other items attached `this` that aren't visible when you log `this`


#### `this.file`
```js
{
  path: 'app/site.scss', // relative path to the file from the root directory
  name: 'site', // name of the file
  type: 'scss', // type of the file
  contents: '.......', // contents of the entire file
  start: 1, // start of the file
  end: 251 // end of the file
}
```

#### `this.options`

```js
{
  // the language object that was used on this file
  language: {
    prefix: '@',
    header: { start: '////', line: '///', end: '////', type: 'header' },
    body: { start: '', line: '///', end: '', type: 'body' },
    inline: { start: '', line: '///#', end: '', type: 'inline' },
    interpolation: { start: '\\${', end: '}' }
  },
  // what ever was passed in the options in the `docsfile.js`
  blank_lines: 4,
  indent: true,
  sort: [
    'name<=0', 'access<=0',
    'author<=1', 'deprecated<=1',
    'description<=1', 'markdown>6',
    'markup>5', 'states>5',
    'note>=-3', 'property',
    'raw-code>6', 'todo>=-2',
    'type<=1', 'version<=1',
    'blockinfo>=-1'
  ],
  page_fallback: 'general',
  // the resulting order of the `this.options.sort` after it was sorted.
  order: [
    'name', 'access',
    'author', 'deprecated',
    'description', 'version',
    'type', 'arg',
    'content', 'property',
    'throws', 'since',
    'returns', 'requires',
    'readonly', 'alias',
    'page', 'chainable',
    'markup', 'states',
    'markdown', 'raw-code',
    'note', 'todo',
    'blockinfo', 'inline'
  ]
}
```

#### `this.comment`

Stores the information for the whole comment block, not just the current annotation.

```js
{
  // the contents array uses the same `Line` object as mentioned above
  // this what it looks like after it was converted to a string and then converted back to an array
  contents: [
    'Buttons',
    'components/buttons',
    'Your standard form button.',
    '',
    '{html}',
    '<div class="c-btn-group">',
    '  <a href="#" class="c-btn ${@state}">Button (a)</a>',
    '  <button class="c-btn ${@state}">Button (button)</button>',
    '  <input class="c-btn ${@state}" type="button" value="Button (input)">',
    '</div>'
  ],

  // start of the comment block (NOT the annotation)
  start: 27,

  // end of the comment block (NOT the annotation)
  end: 36,

  // the type of comment it was `header`, `body`, or `inline` are the only types
  type: 'body'
}
```

#### `this.code`

This stores all the code after the comment block

```js
{
  // the contents array uses the same `Line` object as mentioned above
  // this what it looks like after it was converted to a string and then converted back to an array
  contents: [
    '.c-btn {',
    '  background: #7e7e7c;',
    '  border: none;',
    '  border-radius: 6px;',
    '  color: #fff;',
    '  display: inline-block;',
    '  font-size: 1em;',
    '  font-weight: bold;',
    '  line-height: 1em;',
    '  padding: 0.9286em 1.5em;',
    '  text-align: center;',
    '  text-decoration: none;',
    '  -webkit-transition: background 0.25s ease-out, color 0.25s ease-out;',
    '  transition: background 0.25s ease-out, color 0.25s ease-out;',
    '  vertical-align: middle;',
    '  width: auto;',
    '',
    '  &:hover, &:active, &:focus {',
    '    color: #fff;',
    '    text-decoration: none;',
    '  }',
    '',
    ... 170 more items
  ],

  // start of the code for this comment block
  start: 37,

  // end of the code for this comment block
  end: 229
}
```


#### `this.parent`

If an annotation is an inline comment then it has access to `this.parent` which is the parent body comment.

This object contains all the same things that the `this` object contains but with the parents information


<!-- #### `this.log` -->



### options.autofill

If the annotation doesn't exist and this is set to a function then it will run and be used.

It has everything that the `this` object has that's passed to `options.parsed`. See [@access](/packages/docs-plugin-default-annotations/src/annotations/access.js) for an example of how it can be used.

**Note:** this will not run if the annotation exists

### options.resolve

This runs after `options.parsed` or `options.autofill`. The contents of `this` is what was returned by the `options.parse` or `options.autofill`. It's used to fixed data that was returned by parse or to get items from other annotations. It helps when members on your team pass in the wrong keyword(s) and let's you resolve them here in the data instead of resolving the issues on the client side. It's also useful if you want want
to ensure the data always returns an `array`, or if you need contents from another annotation.



## Custom annotation

For full examples look at all the [default annotations](/packages/docs-plugin-default-annotations)

You must pass in the directory where your assets are located, this way `docs-core` knows where to find these assets.

```js
// docs-plugin-something/src/index.js
import to from 'to-js'

export default {
  annotations: {
    something: {
      alias: [
        'somethingelse', 'something-else'
      ],
      parse() {
        return to.markdown(this.annotation.contents)
      }
    }
  },
  assets: path.join(__dirname, '..', 'public'),
}
```

You must place your annotation under `_annotations` under the folder that you passed above, followed by a file with the name of the annotation you're creating. This way _Docs_ knows where to look for your annotation on how to render it. Note templates are compiled by [Harp](https://github.com/sintaxi/harp).

```jade
// docs-plugin-something/public/_annotations/something.jade
div(class="c-annotation c-annotation--description")
  h4 Description
  != data
```


## Themes

Themes use harpjs build the themes out. The `_data.json` files are created for by `docs-parser`. For an example of how a theme is built see [docs-theme-default](/packages/docs-theme-default)


**Note**: No theme should have a `_annotations` folder. This folder is reserved for plugin annotations.


## Hacking

If you don't like how an annotation is being displayed or want to change the styles you can create a `docs` folder in the root of your project and override anything that you want to. This `docs` directory takes priority over any plugin or theme files.


See [docs-example](/packages/docs-example/docs) for an example of this


## Quickstart

To get started writing documentation, check out the [quickstart guide](https://github.com/tjbenton/docs/wiki/Quickstart).
