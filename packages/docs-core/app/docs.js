/* eslint-disable */
import express from 'express'
// @todo update import link
import docsParser from '../../docs-parser'
// @todo update import link
import logger from '../../docs-helpers-logger'
import to from 'to-js'
import config from './config'

function docs(options = {}) {
  options = config(options)

  try {
    docsParser(options)
  } catch (e) {
    console.log(e)
  }
}

docs.on = logger.on
docs.emit = logger.emit


export default docs