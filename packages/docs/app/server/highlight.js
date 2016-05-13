
const highlight = {}
import hljs from 'jstransformer-highlight'
const highlight_types = [
  'agate', 'atelier-heath-dark', 'grayscale', 'obsidian', 'sunburst', 'androidstudio', 'atelier-heath-light',
  'codepen-embed', 'gruvbox-dark', 'paraiso-dark', 'tomorrow-night-blue', 'arduino-light', 'atelier-lakeside-dark',
  'color-brewer', 'gruvbox-light', 'paraiso-light', 'tomorrow-night-bright', 'arta', 'atelier-lakeside-light',
  'dark', 'hopscotch', 'pojoaque', 'tomorrow-night-eighties', 'ascetic', 'atelier-plateau-dark', 'darkula',
  'hybrid', 'pojoaque', 'tomorrow-night', 'atelier-cave-dark', 'atelier-plateau-light', 'default', 'idea',
  'qtcreator_dark', 'tomorrow', 'atelier-cave-light', 'atelier-savanna-dark', 'docco', 'ir-black',
  'qtcreator_light', 'vs', 'atelier-dune-dark', 'atelier-savanna-light', 'dracula', 'kimbie.dark',
  'railscasts', 'xcode', 'atelier-dune-light', 'atelier-seaside-dark', 'far', 'kimbie.light', 'rainbow',
  'zenburn', 'atelier-estuary-dark', 'atelier-seaside-light', 'foundation', 'magula', 'atelier-estuary-light',
  'atelier-sulphurpool-dark', 'github-gist', 'mono-blue', 'school-book', 'atelier-forest-dark',
  'atelier-sulphurpool-light', 'github', 'monokai-sublime', 'solarized-dark', 'atelier-forest-light',
  'brown-paper', 'googlecode', 'monokai', 'solarized-light',
]
highlight.highlight_types = highlight_types

highlight.highlight = (lines, options) => {
  if (options.toString().slice(9, -1).toLowerCase() !== 'object') {
    options = { lang: options }
  }

  return hljs.render(lines, options)
}
highlight.syntax_highlight = 'agate'

export default highlight
