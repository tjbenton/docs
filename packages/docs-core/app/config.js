/* eslint-disable guard-for-in, no-unused-vars */
import fs from 'fs-extra-promisify'
import to, { is } from 'to-js'
import path from 'path'
const root = process.cwd()

// @todo update import link
import logger from '../../docs-helpers-logger'

// changed by `options` key
export const default_options = {
  docsfile: `${process.cwd()}/.docsfile.js`,

  dest: `${process.cwd()}/docs/docs.json`,

  plugins: [],

  // debugging levels
  debug: false,
  warning: true,
  timestamps: true,
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

  // ensures `files`, `ignore` is always an array this way no
  // more checks have to happen for it
  if (options.files) options.files = to.array(options.files)
  if (options.ignore) options.ignore = to.array(options.ignore)

  // merge options with default_options so there's a complete list of settings
  options = to.extend(to.clone(default_options), options)

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

