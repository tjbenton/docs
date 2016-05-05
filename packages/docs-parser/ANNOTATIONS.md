# Annotations

#### Default Annotations
Annotation                    | Description                                                  | Aliases
------------------------------|--------------------------------------------------------------|----------------
[@name](#name)                | Name of the documented item                                  | -
[@page](#page)                | The page you want the documented item to be on               | @group
[@author](#author)            | Author of the documented item                                | -
[@description](#description)  | Description of the documented item                           | -
[@note](#note)                | A note about the documented item                             | -
[@access](#access)            | Access of the documented item                                | -
[@alias](#alias)              | Whether the documented item is an alias of another item      | -
[@returns](#returns)          | Return from the documented function                          | @return
[@arg](#arg)                  | Parameters from the documented function/mixin                | @argument, @param, @parameter
[@type](#type)                | Describes the type of a variable                             | -
[@todo](#todo)                | Things to do related to the documented item                  | -
[@requires](#requires)        | Requirements from the documented item                        | @require
[@state](#state)              | A state of a the documented item                             | -
[@markup](#markup)            | Code for the documented item                                 | -

#### Sass Specific Annotations
Annotation                    | Description                                                               | Aliases
------------------------------|---------------------------------------------------------------------------|----------------
[@content](#content)          | Describes the usage of `@content` Sass directive in the documented mixin  | -
[@output](#output)            | Provide a description of what’s being printed by the mixin                | @outputs


##### Note:
In the examples below the default settings are being used


## Default Annotations
### @name
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Name of the documented item
Multiple       | false
Default        | -
Aliases        | -
Autofilled     | -

###### Example
```scss
/// @name Name
```

### @page
Attribute      | Value
---------------|----------------------------------------------------------
Description    | The page you want the documented item to be on
Multiple       | true
Default        | -
Aliases        | @group
Autofilled     | -

###### Example
```scss
/// @page components/buttons
```

### @author
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Author of the documented item
Multiple       | true
Default        | -
Aliases        | -
Autofilled     | -

##### Extra notes
Parsed as Markdown.*

###### Example
```scss
/// @author Tyler Benton
```

### @description
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Description of the documented item
Multiple       | false
Default        | -
Aliases        | -
Autofilled     | -

##### Extra notes
Parsed as Markdown.*

###### Example
```scss
/// @description The description of the documented item

/// @description
/// The description of the documented item
```

### @note
Attribute      | Value
---------------|----------------------------------------------------------
Description    | A note about the documented item
Multiple       | true
Default        | -
Aliases        | -
Autofilled     | -

##### Extra notes
Importance is optional.
Description is optional. Hyphen before description is optional.
Description is parsed as Markdown.*

###### Example
```scss
/// @note A note
/// @note {4} A note
/// @note {7} - A note
```

### @access
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Access of the documented item
Multiple       | false
Default        | public
Aliases        | -
Autofilled     | -

##### Extra notes
Either `public` or `private`

###### Example
```scss
/// @access private

/// @access public
```

### @alias
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Whether the documented item is an alias of another item
Multiple       | true
Default        | -
Aliases        | -
Autofilled     | -

##### Extra notes
The other item will automatically have a key named `aliased` containing the name of aliases.

###### Example
```scss
/// @alias other-item
```

### @returns
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Return from the documented function
Multiple       | false
Default        | -
Aliases        | @return
Autofilled     | -

##### Extra notes
Description is optional. Hyphen before description is optional.
Description is parsed as Markdown.*
Multiple types must be separated by pipes (,).

###### Example
```scss
/// @return {type}

/// @return {type, othertype} - description

/// @return {type} description
```


### @arg
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Parameters from the documented function/mixin
Multiple       | true
Default        | -
Aliases        | @argument, @param, @parameter
Autofilled     | -

##### Extra notes
Default value is optional.
Description is optional. Hyphen before description is optional.
Description is parsed as Markdown.*
Multiple types should be separated by pipes (,).

###### Example
```scss
/// @arg {type} name-of-variable
/// @arg {type, othertype} name-of-variable
/// @arg {type} name-of-variable - description
/// @arg {type} name-of-variable [default value] - description
```

### @type
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Describes the type of a variable
Multiple       | false
Default        | -
Aliases        | -
Autofilled     | -

##### Extra notes
Multiple types should be separated with pipes (,).

###### Example
```scss
/// @type {bool}
/// @type {bool, string}
```

### @todo
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Things to do related to the documented item
Multiple       | true
Default        | -
Aliases        | -
Autofilled     | -

##### Extra notes
Importance optional.
Hyphen before description is optional.
Multiple assignees should be seperated by a (,).
Assignee defaults back to the author that was defined.
Description is parsed as Markdown.*

###### Example
```scss
/// @todo Task to be done
/// @todo {3} Task to be done
/// @todo {5} [assignee] - Task to be done
/// @todo {5} [assignee-one, assignee-two] - Task to be done
```

### @requires
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Requirements from the documented item
Multiple       | true
Default        | -
Aliases        | @require
Autofilled     | -

##### Extra notes
`{type}` is optional.
Description is optional. Hyphen before description is optional.
Description is parsed as Markdown.*

###### Example
```scss
/// @require item
/// @require {type} item
/// @require {type} item description
/// @require {type} item - description
```

### @state
Attribute      | Value
---------------|----------------------------------------------------------
Description    | A state of a the documented item
Multiple       | true
Default        | -
Aliases        | -
Autofilled     | -

##### Extra notes
Modifier can be any selector, or pseudo selector.
Description is optional. Hyphen before description is optional.
Description is parsed as Markdown.*
This parser should always be used in conjunction with `@markup`

###### Example
```scss
/// @state modifier
/// @state modifier description
/// @state modifier - description
```

### @markup
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Code for the documented item
Multiple       | true
Default        | -
Aliases        | -
Autofilled     | -

##### Extra notes
- `{language}`
 - Optional.
 - The default language is html
- `[settings]`
 - Optional.
 - It's any settings you determin you need.
 - Settings should be written like this `setting-name="setting value"`
 - Multiple settings should be seperated by a (,).
- Description
 - Optional.
 - Hyphen before description is optional.
 - is parsed as Markdown.*
- `..code..`
 - The code you want to add.
 - It can be any language.

###### Example
```scss
/// @markup
/// ..code..
/// @markup {language}
/// ..code..
/// @markup {language} [settings] description
/// ..code..
/// @markup {language} [settings] - description
/// ..code..
```


## Sass Specific Annotations
### @content
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Describes the usage of `@content` Sass directive in the documented mixin
Multiple       | false
Default        | -
Aliases        | -
Autofilled     | -

##### Extra notes
Parsed as Markdown.*

###### Example
```scss
/// @content Description

/// @content
/// Multi line description
/// Description
```

### @output
Attribute      | Value
---------------|----------------------------------------------------------
Description    | Provide a description of what’s being printed by the mixin
Multiple       | true
Default        | -
Aliases        | -
Autofilled     | -

##### Extra notes
This is really `@markup` with a default type and settings.
- Description
 - Optional.
 - is parsed as Markdown.*

###### Example
```scss
/// @ouput description
/// ..code..
```