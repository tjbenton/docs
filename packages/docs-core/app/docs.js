'use strict'

/* eslint-disable */
import express from 'express'
import docsParser from 'docs-parser'
import logger from 'docs-helpers-logger'
import to from 'to-js'
import config from './config'
import server from './server'

function docs(options = {}) {
  options = config(options)

  try {
    docsParser(options)
  } catch (e) {
    console.log(e)
  }
}

docs.server = server

docs.logger = logger
docs.on = (name, ...args) => logger.on(name, ...args)
docs.emit = (name, ...args) => logger.emit(name, ...args)

export default docs