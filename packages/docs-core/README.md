# Docs

## Usage

```js
const docs = new Docs(options)
```

## Options


```js
{
  // file globs to be parsed to get the documentation
  files: [ 'app/**/*', 'src/**/*', '*.md' ],

  // files to be ignored
  ignore: [
    '.*', // all dot files
    'node_modules/', 'bower_components/', 'jspm_packages/', // package managers
    'dist/', 'build/', 'docs/', // normal folders
    'tests/', 'coverage/' // unit tests and coverage results
  ],

  page_fallback: 'general', // used if `@page` isn't defined

  // this stops the current block from adding lines if there're `n`
  // blank line lines between code, and starts a new block.
  blank_lines: 4,

  debug: false,
  warning: false,
  timestamps: false,

  // stop adding code to the token.code.contents if the indent is less than the starting line indent
  indent: true,

  // plugins to use
  plugins: [],

  // folders locations to where assets are located
  assets: [],

  // folder that has assets to be loaded
  project_assets: path.join(process.cwd(), 'dist'),

  // global variables available to use with templates
  global: {},

  // the theme to use
  theme: '',

  // debugging levels
  debug: false,
  warning: false,
  timestamps: false,

  // sort order for annotations
  sort: [
    'name<=0',
    'access<=1',
    'author<=1',
    'deprecated<=1',
    'description<=1',
    'markdown>6',
    'markup>5',
    'states>5',
    'note>=-3',
    'raw-code>6',
    'todo>=-2',
    'type<=1',
    'version<=1',
    'blockinfo>=-1',
  ],

  languages: {
    default: {
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
    },
    css: {
      header: { start: '/***', line: '*', end: '***/' },
      body: { start: '/**', line: '*', end: '**/' },
      inline: { start: '/**#', line: '', end: '**/' }
    },
    'rb, py, coffee, sh, bash, pl': {
      header: { start: '###', line: '##', end: '###' },
      body: { line: '##' },
      inline: { line: '##$' }
    },
    // dono why markdown supports so many file extensions
    'html, md, markdown, mark, mdown, mkdn, mdml, mkd, mdwn, mdtxt, mdtext, text': {
      header: { start: '<!----', line: '', end: '---->' },
      body: { start: '<!---', line: '', end: '--->' },
      inline: { start: '<!---#', line: '', end: '--->' }
    },
    'jade, pug': {
      header: { start: '//-//', line: '//-/', end: '//-//' },
      body: { line: '//-/' },
      inline: { line: '//-#' }
    },
    cfm: {
      header: { start: '<!-----', line: '', end: '----->' },
      body: { start: '<!----', line: '', end: '---->' },
      inline: { start: '<!----#', line: '', end: '---->' }
    }
  },

  // annotations object
  annotations: {}
}
```



## CLI

```bash
Usage: docs [options] [command]


  Commands:

    server [options]   Start a docs server
    compile [output]   Compile project to static assets (HTML, JS and CSS)

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -r, --require <pkg, ...pkgs>  Require packages before
```
