import stylus from 'stylus'
import postcss from 'poststylus'

export default function styles(app) {
  app.use(stylus.middleware({
    src: app.dir.app,
    dest: app.dir.public,
    force: true,
    sourcemap: true,
    debug: true,
    compile(str, styl_path) {
      return stylus(str)
        .use(postcss([
          'autoprefixer',
          'css-mqpacker'
        ]))
        .set('filename', styl_path)
        // .set('compress', true) // compress
    }
  }))
}
