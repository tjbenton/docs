import pkg from '../package.json'
import program from 'commander'
import path from 'path'
export default function cli() {
  program
    .version(pkg.version)
    .usage('docs <docsfile path>')
    .option('-r, --require <pkg, ...pkgs>', 'Require packages before', '')
    .parse(process.argv)

  if (program.require) {
    program.require
      .split(/,?\s+/)
      .forEach((_pkg) => {
        try {
          require(_pkg)
        } catch (err) {
          console.log(err)
        }
      })
  }

  let file = program.args[0] || 'docsfile.js'
  file = path.join(process.cwd(), file)
  try {
    require(file)
  } catch (err) {
    console.log(err)
  }
}
