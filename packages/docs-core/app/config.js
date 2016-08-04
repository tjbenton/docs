/* eslint-disable guard-for-in, no-unused-vars */
import fs from 'fs-extra-promisify'
import to, { is } from 'to-js'
import path from 'path'
import logger from 'docs-helpers-logger'
const root = process.cwd()

// changed by `options` key
export const default_options = {
  plugins: [],

  assets: [],

  watch: true,
  raw: false,

  theme: '',

  // debugging levels
  debug: false,
  warning: false,
  timestamps: false,
}

export default function config(options = {}) { // eslint-disable-line
  const config_files = [ 'package.json', '.docsfile', 'docsfile.js' ]
    .map((file) => {
      try {
        return require(path.join(root, file))
      } catch (e) {
        return {}
      }
    })
  config_files[0] = config_files[0].docs || {}

  const user_options = Object.assign(...config_files)

  // merge the config file with passed options
  options = to.extend(user_options, options)

  // ensure that the plugins option is an array
  // and add the default annotations to the plugins plist
  options.plugins = to.array(options.plugins)
  options.plugins.unshift('default-annotations')

  options = to.extend(options, getPlugins(options.plugins))

  if (!options.theme) {
    logger.error('You must specificy a theme')
  } else {
    const theme = getPlugin(options.theme, 'theme',
      `docs-theme-${options.theme.replace('docs-theme-', '')}  could not be found try installing docs-theme-default`)
    options = to.merge(options, theme)
  }

  options.assets = to.unique(to.array(options.assets))

  // merge options with default_options so there's a complete list of settings
  options = to.extend(to.clone(default_options), options)

  options.assets.push(path.join(root, 'docs'))

  logger.options.debug = options.debug
  logger.options.warning = options.warning
  logger.options.timestamps = options.timestamps

  return options
}


function getPlugins(plugins, prefix = 'plugin') {
  return to.reduce(plugins, (prev, next) => to.merge(prev, getPlugin(next, prefix)), {})
}

function getPlugin(plugin, prefix, message = '') {
  prefix = `docs-${prefix}-`
  try {
    // if the plugin path isn't relative then add the docs-plugin- prefix to it.
    if (!/^\./.test(plugin)) {
      plugin = prefix + plugin.replace(prefix, '')
    } else {
      plugin = path.resolve(root, plugin)
    }
    try {
      plugin = require(plugin)
    } catch (e) {
      // @todo REMOVE THIS AFTER docs-theme-default is added to npm
      plugin = require(path.join(process.cwd(), '..', plugin))
    }

    if (plugin.default) {
      plugin = plugin.default
    }

    if (plugin.plugins) {
      return to.merge(plugin, getPlugin(plugin.plugins, prefix))
    }
  } catch (e) {
    logger.error(e)
    // logger.error(!!message ? message : e)
    return {}
  }

  return plugin
}
