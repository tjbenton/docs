/* eslint-disable guard-for-in, no-unused-vars */
import fs from 'fs-extra-promisify'
import to, { is } from 'to-js'
import path from 'path'
import logger from 'docs-helpers-logger'
const root = process.cwd()

// changed by `options` key
export const default_options = {
  docsfile: `${process.cwd()}/.docsfile.js`,

  dest: `${process.cwd()}/docs/docs.json`,

  plugins: [],

  // debugging levels
  debug: false,
  warning: false,
  timestamps: false,
}

export default function config(options = {}) { // eslint-disable-line
  let config_file = (options.docsfile ? options : default_options).config

  if (!!options.plugins) {
    options = to.extend(options, getPlugins(options.plugins))
  }

  // try to get the `docsfile.js` so the user config can be merged
  try {
    // merge the default options with the user options
    config_file = require(config_file)
    console.log('config_file:', config_file)
  } catch (err) {
    config_file = {}
  }

  // merge the config file with passed options
  options = to.extend(config_file, options)

  // merge options with default_options so there's a complete list of settings
  options = to.extend(to.clone(default_options), options)

  logger.options.debug = options.debug
  logger.options.warning = options.warning
  logger.options.timestamps = options.timestamps

  return options
}


function getPlugins(plugins) {
  return to.reduce(plugins, (prev, next) => to.extend(prev, getPlugin(next)), {})
}

function getPlugin(plugin) {
  try {
    // if the plugin path isn't relative then add the docs-plugin- prefix to it.
    if (!/^\./.test(plugin)) {
      plugin = 'docs-plugin-' + plugin.replace('docs-plugin-', '')
    } else {
      plugin = path.resolve(root, plugin)
    }
    plugin = require(plugin)

    if (plugin.default) {
      plugin = plugin.default
    }

    if (plugin.plugins) {
      return to.extend(plugin, getPlugin(plugin.plugins))
    }
  } catch (e) {
    console.log(e)
    logger.emit('error', e)
    return {}
  }

  return plugin
}

