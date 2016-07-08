# Docs

<br>
<!-- [![Build Status][travis-image]][travis-url] -->
<!-- [![License][license-image]][license-url] -->

<!-- [![NPM][npm-image]][npm-url] -->

Docs, addapts to any language and will help you document all the things.
Where there is development there is a need for documentation. There are several great libraries for all sorts of files, written by brilliant developers, libraries like [SassDoc][sass-doc], [JSDoc][js-doc], [JavaDoc][java-doc], [Jazzy][jazzy], [StyleDocco][styledocco], [KSS][kss], [Hologram][hologram], [DSS][dss] and several more. All of these libraries do a very good job for documenting their respective languages. However there are very few projects that only require 1 file type. Which means if you really want to document all your code you may have to use 3 or 4 of these documentation generators. Each of the generators have their own way of documenting and their annotations, and their own document site which just makes it harder to keep all your documentation in one spot.

Docs fixes all these issues by giving you the ability to generate documentation for all your files. While giving you control over what annotations you want to use in each file type.


## Options

*files*: file globs to be parsed to get the documentation
default
```js
[ 'app/**/*', 'src/**/*', '*.md' ]
```


*ignore*: files globs to be ignored
default
```js
[
  '.*', // all dot files
  'node_modules/', 'bower_components/', 'jspm_packages/', // package managers
  'dist/', 'build/', 'docs/', // normal folders
  'tests/', 'coverage/' // unit tests and coverage results
]
```

*watch*: when true it will watch files for changes
default `false`

*raw*: Will return the raw data by file, aka data won't be sorted
default `false`




*languages*: This is an object of comment styles for various languages.
default

```js
{
  // annotation identifier that can be change on a file specific basis if needed.
  // While this is a setting, it probably should probably never be changed. If it does
  // need to be changed it should be changed to be a special character.
  prefix: '@',

  // header comment style
  // @note {10} only 1 of these can be used per file
  header: { start: '////', line: '///', end: '////', type: 'header' },

  // body comment style
  body: { start: '', line: '///', end: '', type: 'body' },

  // inline comments for body comments
  inline: { start: '', line: '///#', end: '', type: 'inline' },

  // this is used for any interpolations that might occur in annotations.
  // I don't see this needing to change but just incase I'm making it a setting.
  // @note {10} This setting is used to create a RegExp so certain characters need to be escaped
  interpolation: {
    start: '\\${',
    end: '}'
  },
}
```

for other predefined languages see the [defined languages](https://github.com/tjbenton/docs/blob/master/packages/docs-parser/src/config.js#L58)


## Usage

```js
import parser from 'docs-parser'
import fs from 'fs-extra-promisify'

parser({ files: 'app/**/*' })
  .then((data) => fs.outputJson('docs/docs.json', data))
```


## Adding a annotation

documentation for it is coming soon (if your curious just look at `src/annotations/*`)

<!-- ##### Callback `this`:

- `this.annotation`: Information about the annotation
  - `this.annotation.name`: Name of this annotation
  - `this.annotation.line`: The string that is on the same line as the declared annotation
  - `this.annotation.contents`: The content assosiated with the annotation
  - `this.annotation.start`: Start of the annotation
  - `this.annotation.end`: End of the annotation
- `this.comment`: Information about the current comment block
  - `this.comment.contents`: The content assosiated the comment block
  - `this.comment.start`: Start of the comment block
  - `this.comment.end`: End of the comment block
- `this.code:` Information about the code after the current comment block
  - `this.code.contents`: The code after the current comment block
  - `this.code.start`: Start of the code
  - `this.code.end`: End of the code
- `this.file`: Information about the file the comment block is in
  - `this.file.contents`: The file contents
  - `this.file.path`: Path of the file
  - `this.file.type`: Type of the file
  - `this.file.start`: start of the file(aka `0`)
  - `this.file.end`: Total lines in the file
- `this.add`: Allows you to add other annotations based off of the information in the current annotation callback(see example below)
- `this.default`: This allows you to call the default annotation callback if you specific a specific filetype callback for an annotation. **Note** This is only avaiable on specific filetype callbacks. -->

<!-- #### Annotation Examples:
###### Defining a basic annotation with only a default callback function

```js
docs.annotation("name", function(){
 return this.annotation.line;
});
```

###### Overwriting an annotation for a specific filetype

```js
docs.annotation("name", {
 default: function(){ // default callback for every other filetype
  return this.annotation.line;
 },
 scss: function(){ // callback for `.scss` files only
  return this.annotation.line + " scss specific";
 }
});
```

###### Using `this.default()`

```js
docs.annotation("name", {
 default: function(){ // default callback for every other filetype
  return this.annotation.line;
 },
 scss: function(){ // callback for `.scss` files only
  return this.default() + " scss specific";
 }
});
```

###### Writing a file specific annotation only

```js
// This will only be applied to `.scss` files
// Since `default` wasn't defined you can't call it
docs.annotation("content", {
 scss: function(){
  return this.annotation.line || this.annotation.contents;
 }
});
```

###### Adding an different annotation within an annotation
```js
docs.annotation("arg", {
 default: function(){
  // ...code for arg...
  return {
   ...
  }
 },
 scss: function(){
  // ...code for scss specific arg...

  var code = this.code.contents,
      mixin = code.match(/\@mixin\s(.*)(?:\()/),
      func = code.match(/\@function\s(.*)(?:\()/);

  if(mixin[0]){
   this.add("name", mixin[0]);
   this.add("is-mixin", code);
  }else if(func[0]){
   this.add("name", func[0]);
   this.add("is-function", code);
  }

  // the return object for `arg`
  return {
   ...
  }
 }
});
``` -->

## Default Annotations
See more on the [default annotations](ANNOTATIONS.md)

## Documenting your items
There are 2 different types of comment blocks **block level**, and **file level**.

### Block level comment
This type of comment is used multiple times per file.

```scss
/// @author Tyler Benton
/// @page functions/numbers
/// @description
/// This function does something awesome, I swear.
@function some-function(){
  // ...
}
```


### File level comment
This type of comment can only occur **once** per file. Any annotations that are found inside of the file level comment will become the default value for the block level comments. It is very useful when you have a whole file sharing some annotations (@author, @page and so on).

```scss
////
/// @author Tyler Benton
/// @page functions/numbers
/// @description Useful number functions
////

/// @description
/// This item will have: `@page functions/numbers` and `@author Tyler Benton`
/// inherited from the file level comment, but not `@description`
@function some-function(){
  // ...
}

/// @author John Doe
/// @description
/// This item overrides the `@author` annotation
@mixin some-mixin{
  // ...
}
```


# Todo
 - Add the ability to add aliases
   - Take into account the ability to specify alias and file types. For example being able to extend something onto the `name` but use the `scss` specific filetype callback.
 - Double check to make sure that if a user specifies the same name and page for a comment block that it gets merged properly
    ```scss
    /// @name Beards
    /// @page beards
    /// @description
    /// An awesome collection of beards in css
    /// @markup
    /// <div class="c-beard"></div>
    .c-beard {
      ...
    }
    ```

    ```js
    /// @name Beards
    /// @page beards
    /// @markup
    /// <div class="c-beard js-beardme"></div>
    /// @markup
    /// beard_me('.js-beardme')
    function beard_me(selector) {
      document.body.addEventListener('click', function(e) {
        if ((e.target || {}).classList.contains(selector.replace('.', ''))) {
          e.target.classList.toggle('is-bearded')
        }
      })
    }
    ```
 - Ability to add single line notations, or allow the user to define how many lines they want to return. The way it would work is to have a special identifier after the opening comments(eg `/**#{2} @remove */`) for laguages that use them, or after the single line comment(`///#{5}`). If you didn't want to return multiple lines, then you could just write `///#` and it would return everything before the comment. Note that `///#` is different that `///#{1}` because the `{2}` telling the parser to return the next 2 lines. There couldn't be any spaces inbetween the specified comment style and the special character that's used to identify this type of comment. Having this ability would allow you to do things like the following.

   ###### Returning a single line example

   ```css
    .foo{
     background: blue;
     outline: 1px solid red; /**# @remove #*/
     margin: 10px; /**# @todo {10} - fix spacing */
    }
    .foo--bar{ /**# @state */
      background: black;
    }
   ```

   ```scss
   .foo{
    background: blue;
    outline: 1px solid red; ///# @remove
    margin: $bar; ///# @todo {10} - fix spacing

    &--bar{ ///# @state
     background: black;
    }
   }
   ```

   ```js
    function foo(){
     console.log(arguments); ///# @remove
    }
   ```

   ###### Returning a specified number of lines.<br>

   ```css
    .foo{
     margin: 10px;

     /**#{2} @remove #*/
     background: cyan;
     outline: 1px solid red;
    }
   ```

   ```scss
   .foo{
     margin: 10px;

     ///#{2} @remove
     background: cyan;
     outline: 1px solid red;
    }
   ```

   ```js
    function foo(){
     ///#{2} @remove
     console.log(arguments);
     console.log(arguments[0]);
    }
   ```

   These types of comments are fairly common throughout any development procces for temp code that's for debugging or notes to come back and fix the issue. The number that is passed to `#{2}` is referring to the number of lines after the comment.

 - Figure out a way to have nested comment blocks so the nested comment blocks can be tied to the initial comment block.

   ```js
   /// @name parseBlocks
   /// @description Parses each block in blocks
   /// @returns {array}
   parseBlocks = function(){
     /// @name this.merge
     /// @description Used as a helper function because this action is performed in two spots
     /// @arg {object} annotation - information of the current annotation block
     /// @arg {object} info - information about the current comment block, the code after the comment block and the full file contents
     /// @returns {object}
     this.merge = (annotation, info) => {
       ...
     };
   };
   ```
  - Look into adding a callback function that runs after the block has been completely parsed this would be run after the single line comments are parsed. I'm not sure how useful this would be but it's a thought.
    - This could allow you to create your own data structure.
  - Come up with a name for the project
  - Auto generate the site's navigation based off of `@page`.
  - Create a styleguide site based off the JSON output. This will be in a seperate repo to keep the parser functionality seperate from the themes. As of now It will be written in angular because to my knowledge it's the easiest to implement. The parser and the theme will probably not come packaged together because it would make it harder to add themes.
    - Navigation
    - Search
    - Include language parsing
    - Include `@state` replacement.
 - Look into being able to reference a different language comment style withing the existing language.
   For example this would allow you to write JS documentation inside of an HTML document
   ```html
   <script>
   <!---{js}
    @name something awesome
    @description
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae praesentium voluptates beatae ducimus dolore velit excepturi maiores delectus doloribus labore totam odio culpa, magni reprehenderit est similique aspernatur dolor rerum?
   ---->
   </script>
   ```
    ###### Need to figure out
    - Treat the block as it's own file and re-run `get_blocks`
    - How to store the information?
      - Does it go along with the HTML it was found in? If so does it go under other?
        ```
        {
         header,
         body,
         other
        }
        ```

<!-- Document Generators -->
[sass-doc]: https://github.com/SassDoc/sassdoc
[js-doc]: https://github.com/jsdoc3/jsdoc
[java-doc]: http://www.oracle.com/technetwork/java/javase/documentation/index-jsp-135444.html
[jazzy]: https://github.com/realm/jazzy
[styledocco]: https://github.com/jashkenas/docco
[kss]: https://github.com/kneath/kss
[hologram]: https://github.com/trulia/hologram
[dss]: https://github.com/DSSWG/DSS

<!-- other -->
[npm-url]: https://www.npmjs.com/package/cameleon
[npm-image]: https://nodei.co/npm/cameleon.png?downloads=true
[travis-url]: https://travis-ci.org/tjbenton/docs?branch=master
[travis-image]: https://travis-ci.org/tjbenton/docs.svg?style=flat-square
[license-image]: http://img.shields.io/npm/l/sassdoc.svg?style=flat-square
[license-url]: LICENSE.md
