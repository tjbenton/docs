// File System
import fs from 'fs-extra'
import promisify from 'es6-promisify'

// The functions below are converted into promises
fs.readJson = promisify(fs.readJson)
fs.outputJson = promisify(fs.outputJson)
fs.stat = promisify(fs.stat)
fs.readFile = promisify(fs.readFile)
fs.ensureFile = promisify(fs.ensureFile)

export default fs
