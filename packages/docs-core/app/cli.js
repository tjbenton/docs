import pkg from '../package.json'
import commander from 'commander'
import Docs from './docs.js'
import { is } from 'to-js'


export default function cli() {
  commander
    .version(pkg.version)
    .option('-r, --require <pkg, ...pkgs>', 'Require packages before', '')

  requirePackages(commander.require)

  commander
    .command('server')
    .option('-i, --ip <ip>', 'Specify IP to bind to')
    .option('-p, --port <port>', 'Specify a port to listen on')
    .usage('starts a docs server')
    .description('Start a docs server')
    .action(async (options) => {
      const { ip = '0.0.0.0', port = 9966 } = options
      const docs = new Docs()
      await docs.server({ ip, port })
      const address = ip === '0.0.0.0' || ip === '127.0.0.1' ? 'localhost' : ip
      console.log(`Your server is listening at http://${address}:${port}`)
    })

  commander
    .command('compile [output]')
    .usage([
      'compile your docs files to static assets (HTML, JS and CSS).',
      'Use this command if you want to host your docs without using the docs web server.'
    ].join('\n'))
    .description('Compile project to static assets (HTML, JS and CSS)')
    .action(async (output) => {
      const docs = new Docs()
      try {
        await docs.compile(output)
      } catch (e) {
        console.log(e)
      }
    })

  // let type = program.args[0]
  // let file = program.args[1] || 'docsfile.js'
  // file = path.join(process.cwd(), file)
  // try {
  //   require(file)
  // } catch (err) {
  //   console.log(err)
  // }
  commander.parse(process.argv)

  if (commander.args.length < 1) {
    commander.help()
  }
}

function requirePackages(packages, noop = false) {
  if (!packages) {
    return
  }

  packages = is.array(packages) ? packages : packages.split(/,\s*|\s+/)
  packages = packages.filter(Boolean)

  return packages.map((_pkg) => {
    try {
      return require(_pkg)
    } catch (err) {
      if (noop === false) {
        console.log(err)
      } else {
        return noop
      }
    }
  })
}
