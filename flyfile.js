/* eslint-disable no-invalid-this */
import path from 'path'

export default async function build() {
  await this
    .source(
      path.join('packages', '*', 'src', '**', '*.js'),
      path.join('packages', '*', 'app', '**', '*.js'),
    )
    .target('packages', { insert: 'dist' })

  const others = [ 'scripts', 'tools', 'test' ]
  const promises = []

  for (let other of others) {
    this
      .source(path.join('packages', '*', `${other}-src`, '**', '*.js'))
      .target('packages', { insert: `${other}` })
    promises.push(other)
  }

  await Promise.all(promises)
}
