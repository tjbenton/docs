# docs-plugin-default-annotations

##### Note:

In the examples below the default settings are being used
All descriptions are parsed as markdown

### @access

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Access of the documented item
File types     | Any
Multiple       | false
Default        | public
Aliases        | -
Autofilled     | true

##### Notes

Either `public`, `private`, `protected`

###### Example

```js
/// @access public

/// @access private

/// @access protected
```



### @alias

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Whether the documented item is an alias of another item
File types     | Any
Multiple       | true
Default        | -
Aliases        | -
Autofilled     | false

<!-- ##### Notes
The other item will automatically have a key named `aliased` containing the name of aliases. -->

###### Example

```js
/// @alias other-item

/// @alias foo, bar
```



### @arg

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Parameters from the documented function/mixin
File types     | Any
Multiple       | true
Multi-line     | true
Default        | -
Aliases        | @argument, @param, @parameter
Autofilled     | false

##### Notes

Description is optional, and hyphen before description is optional.
The variable can't contain spaces.
Default value is optional.
Description is parsed as Markdown.
Multiple types should be separated by pipes (,).
Autofilled for some languages based off docs plugins, see their documentation for more details

###### Example

```js
/// @arg {type} variable

/// @arg {type, othertype} variable

/// @arg {type} variable - description

/// @arg {type} variable [default value] - Lorem ipsum dolor sit amet, consectetur adipisicing elit

/// @arg {type} variable [default value] - Lorem ipsum dolor sit amet, consectetur adipisicing elit
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
/// dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
```



### @author

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Author(s) of the documented item
File types     | Any
Multiple       | true
Multi-line     | false
Default        | -
Aliases        | @authors
Autofilled     | false

###### Example

```js
/// @author John Doe
```

Multiple authors separated by a comma
```js
/// @author John Doe, Jane Doe
```

Multiple authors by multiple annotations
```js
/// @author Author One
/// @author Author Two
```



### @blockinfo

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Location of the comment
File types     | Any
Multiple       | false
Multi-line     | false
Default        | The location of the file
Aliases        | -
Autofilled     | true

##### Notes

This annotation can't be referenced in a comment block because it's autofilled, if it's
referenced it will throw an error.

###### Example output

```json
"blockinfo": {
  "comment": {
    "start": 1,
    "end": 1,
    "type": "body"
  },
  "code": {
    "start": -1,
    "end": -1
  },
  "file": {
    "path": "docs/packages/docs-parser/tests/fixtures/annotations/access/access.autofill.body.js",
    "start": 1,
    "end": 2
  }
}
```



### @chainable

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Used to notate that a function is chainable
File types     | Any
Multiple       | true
Multi-line     | false
Default        | -
Aliases        | -
Autofilled     | false

###### Example

```js
/// @chainable

/// @chainable true

/// @chainable false

/// @chainable Object.prototype

/// @chainable One, Two

/// @chainable
/// One,
/// Two

/// @chainable
/// One
/// Two
```



### @deprecated

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Defines if the documented item is deprecated
File types     | Any
Multiple       | false
Multi-line     | true
Default        | -
Aliases        | -
Autofilled     | false

###### Example

```js
/// @deprecated

/// @deprecated {0.0.1} - Lorem ipsum dolor sit amet

/// @deprecated {0.0.1} Lorem ipsum dolor sit amet

/// @deprecated {^0.0.1}
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis maiores veritatis,
/// sed repellat voluptatibus, eaque nihil assumenda odit at, ea consequatur provident
```



### @description

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Description of the documented item
File types     | Any
Multiple       | false
Multi-line     | true
Default        | -
Aliases        | @desc, @definition, @explanation, @writeup, @summary, @summarization
Autofilled     | false

##### Notes

Parsed as Markdown.*

###### Example

```js
/// @description Lorem ipsum dolor sit amet.

/// @description ## Lorem ipsum dolor sit amet.
/// Consectetur `adipisicing` elit. Natus hic *voluptatum* expedita velit esse
/// amet repudiandae ab consectetur, quasi assumenda? The description of the documented item
```



### @markdown

Attribute      | Value
---------------|----------------------------------------------------------
Description    | This markdown annotation is used to add a markdown files contents to the documentation. It's typically only used in a header comment along with `@page`.
File types     | `.markdown`, `.mark`, `.mdown`, `.mkdn`, `.mdtxt`, `.mkd`, `.mdml`, `.mdwn`, `.mdtext`, `.text`, `.md`
Multiple       | false
Multi-line     | false
Default        | -
Aliases        | -
Autofilled     | false

###### Example

```markdown
<!----
@markdown
---->
# H1 Tag

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur aspernatur illum quibusdam, dignissimos sapiente harum iusto. Consequatur, optio excepturi minima, dicta sunt nobis, aliquam dolorum itaque iusto quidem voluptates architecto.

  - Lorem ipsum dolor sit amet.
  - Provident cumque modi voluptate dolore.
  - Vitae reprehenderit dolore dolor, architecto!
  - Ut optio laborum ipsum molestias.
  - Voluptate suscipit assumenda minus facilis?
```



### @markup

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Code for the documented item
File types     | Any
Multiple       | true
Multi-line     | true
Default        | -
Aliases        | @code, @example, @output, @outputs
Autofilled     | false

##### Notes

  - All settings are optional
  - `(id)` - is used with [@states](#@states)
  - `{language}` - Sets the language to use for syntax highlighting, it defaults to the current filetype
  - `[settings]` - Is used for extra settings in the view that you may want to apply. These are added as attributes.
  - `description` - Additional description for the markup.

###### Example

```js
/// @markup
/// code

/// @markup (id)
/// code

/// @markup {language}
/// code

/// @markup [settings]
/// code

/// @markup description
/// code

/// @markup (id) {language} [settings] - description
/// code

/// @markup (id) {language} [settings] description
/// code
```



### @name

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Name of the documented item
File types     | Any
Multiple       | false
Multi-line     | false
Default        | -
Aliases        | @title, @heading, @header
Autofilled     | false

###### Example

```js
/// @name Name
```



### @note

Attribute      | Value
---------------|----------------------------------------------------------
Description    | A note about the documented item
File types     | Any
Multiple       | true
Multi-line     | false
Default        | -
Aliases        | -
Autofilled     | false

##### Notes

Importance is optional.
Description is optional. Hyphen before description is optional.
Description is parsed as Markdown.*

###### Example

```js
/// @note Lorem ipsum dolor sit amet

/// @note {10} Lorem ipsum dolor sit amet

/// @note {10} - Lorem ipsum dolor sit amet

/// @note
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit,
/// sed do eiusmod tempor incididunt ut labore et dolore magna

/// @note {5}
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit,
/// sed do eiusmod tempor incididunt ut labore et dolore magna

/// @note {5} Lorem ipsum dolor sit amet
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit,
/// sed do eiusmod tempor incididunt ut labore et dolore magn
```

##### Notes

 - If you use @page in the header comment of the file all comment blocks below will also be added to that page.
 - You can also add @page to a comment block and it will also go on that page


### @page

Attribute      | Value
---------------|----------------------------------------------------------
Description    | The page you want the documented item to be on
File types     | Any
Multiple       | true
Multi-line     | false
Default        | -
Aliases        | @group
Autofilled     | true

###### Example

```js
////
/// @page level 1/level 2
////

/// @page level 1/level 2
```



### @property

Attribute      | Value
---------------|----------------------------------------------------------
Description    | A property from the documented object/array
File types     | Any
Multiple       | true
Multi-line     | false
Default        | -
Aliases        | @prop, @key
Autofilled     | false


###### Example

```js
/// @property {type} key.name

/// @property {type, othertype} key.name

/// @property {type} key.name - description

/// @property {type} key.name [default] - Lorem ipsum dolor sit amet, consectetur adipisicing elit

/// @property {type} key.name [default] - Lorem ipsum dolor sit amet, consectetur adipisicing elit
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
/// dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
```

For examples on how to use @property as an inline annotation see the [tests cases](https://github.com/tjbenton/docs/blob/master/packages/docs-parser/tests/annotations/property/property.inline.js) for it


### @raw-code

Attribute      | Value
---------------|----------------------------------------------------------
Description    | This will output the raw code below the comment block
File types     | Any
Multiple       | false
Multi-line     | false
Default        | -
Aliases        | -
Autofilled     | false

###### Example

```js
/// @raw-code
```



### @readonly

Attribute      | Value
---------------|----------------------------------------------------------
Description    | To note that a property is readonly.
File types     | Any
Multiple       | false
Multi-line     | false
Default        | true
Aliases        | -
Autofilled     | false

###### Example

```js
/// @readonly

/// @readonly true

/// @readonly false
```


### @requires

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Requirements from the documented item
File types     | Any
Multiple       | true
Multi-line     | true
Default        | -
Aliases        | @require
Autofilled     | false

###### Example

```js
/// @requires {type}

/// @requires name

/// @requires description

/// @requires {type, othertype} name - description

/// @requires {type, othertype} name description

/// @requires {type, othertype} name
/// description
```

### @returns

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Return from the documented function
File types     | Any
Multiple       | false
Multi-line     | true
Default        | -
Aliases        | @return
Autofilled     | false

###### Example

```js
/// @returns

/// @returns {}

/// @returns {type}

/// @returns {type, othertype} - Lorem ipsum dolor sit amet

/// @returns {type} Lorem ipsum dolor sit amet

/// @returns {type} - This super awesome object
/// ```js
/// {
///   i: {
///     found: {
///       waldo: 'Shoot, you found me'
///     }
///   }
/// }
/// ```
```



### @since

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Let's you know what version of the project a something was added
File types     | Any
Multiple       | false
Multi-line     | true
Default        | -
Aliases        | -
Autofilled     | false

###### Example

```js
/// @since {0.0.1}

/// @since {0.0.1} - Lorem ipsum dolor sit amet

/// @since {0.0.1} Lorem ipsum dolor sit amet

/// @since {^0.0.1}
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis maiores veritatis,
/// sed repellat voluptatibus, eaque nihil assumenda odit at, ea consequatur provident
```



### @state

Attribute      | Value
---------------|----------------------------------------------------------
Description    | A state of a the documented item
File types     | Any
Multiple       | true
Multi-line     | true
Default        | -
Aliases        | @state
Autofilled     | false

##### Notes

  - This annotation **must** be used with [@markup](#@markup)
  - If @markup doesn't exist then it will error.
  - `(id)` - is used to tie it to a specific [@markup](#@markup) if needed
    it will attempt to auto fill this with the correct markup block but can be
    named if needed.
  - `{state}` - This is the state for the documented item.
  - `[state_id]` - This is used to reference a state in the @markup annotation code. It will default to the nth number in the list(aka if you have three @states the last one will be 2 #zerobased)
  - `description` - A description for the state if needed


###### Example

```js
/// @state {state}
/// @state {state}
/// @state {state}
/// @state {state}

/// @state (id) {state} [state_id] - description
/// @state (id) {state} [state_id] - description
/// @state (id) {state} [state_id] - description

/// @state (id)
/// {state} - description
/// {state} - description
/// {state} - description

/// @states (id)
/// {state} [state_id] - description
/// {state} [state_id] - description
/// {state} [state_id] - description
```

This annotation is one of the most extensible annotations so it could be a little confusing at first.
To get a better understanding of how to utilize it take a look at one of the 15+ [examples](https://github.com/tjbenton/docs/tree/master/packages/docs-parser/tests/annotations/state) that range from stupid simple to complex.



### @throws

Attribute      | Value
---------------|----------------------------------------------------------
Description    | The error that happens if something goes wrong
File types     | Any
Multiple       | true
Multi-line     | true
Default        | -
Aliases        | @throw, @exception, @error, @catch
Autofilled     | false

###### Example

```js
/// @throws

/// @throws {fileNotFound}

/// @throws {fileNotFound} Lorem ipsum dolor sit amet, consectetur adipisicing elit.

/// @throws {fileNotFound} - Lorem ipsum dolor sit amet, consectetur adipisicing elit.

/// @throws {fileNotFound}
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod sequi adipisci illum.
/// Atque itaque sequi, qui ratione aliquid debitis dolorem alias blanditiis, impedit

/// @throws {warning} some warning message
/// @throws {error} when something goes wrong
```



### @todo

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Things to do related to the documented item
File types     | Any
Multiple       | true
Multi-line     | true
Default        | -
Aliases        | -
Autofilled     | false

###### Example

```js
/// @todo Task to be done

/// @todo {3} Task to be done

/// @todo {5} [assignee] - Task to be done

/// @todo {5} [assignee-one, assignee-two] - Task to be done

/// @todo {5} [assignee-one, assignee-two]
/// Task
/// to
/// be
/// done
```



### @type

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Describes the type of a variable
File types     | Any
Multiple       | false
Multi-line     | true
Default        | -
Aliases        | -
Autofilled     | false

###### Example

```js
/// @type {object}

/// @type Lorem ipsum dolor sit amet, consectetur adipisicing elit.

/// @type - Lorem ipsum dolor sit amet, consectetur adipisicing elit.

/// @type {array} - Lorem ipsum dolor sit amet, consectetur adipisicing elit.

/// @type {array} Lorem ipsum dolor sit amet, consectetur adipisicing elit.

/// @type {array}
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos, quod
/// libero tenetur rerum odio harum perferendis repellat sunt, soluta expedita
```



### @version

Attribute      | Value
---------------|----------------------------------------------------------
Description    | Describes the version of the documented item
File types     | Any
Multiple       | false
Multi-line     | true
Default        | -
Aliases        | -
Autofilled     | false

###### Example

```js
/// @version

/// @version {0.0.1}

/// @version {^0.0.1} Lorem ipsum dolor sit amet, consectetur adipisicing elit.

/// @version {^0.0.1} - Lorem ipsum dolor sit amet, consectetur adipisicing elit.

/// @version {1.0.1}
/// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium necessitatibus
/// laboriosam, hic odit sequi facilis, amet consequuntur ullam, rem iure commodi doloremque
```
