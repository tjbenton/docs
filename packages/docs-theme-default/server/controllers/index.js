import fs from 'fs'
import path from 'path'
export default function controllers(app) {
  let controlls = {}

  function getData(route) {
    const route_nodes = route.slice(1).split('/')
    let view = app.locals.pages

    for (var i = 0; i < route_nodes.length; i++) {
      if (view.toString().slice(8, -1) !== 'Object') {
        break
      }

      view = view[route_nodes[i]]
    }

    return view && view.page
  }

  controlls.index = (req, res) => {
    console.log(app.locals.pages.home.page.header.markdown.split('\n'))
    // setTimeout(() => {
    //   fs.readFile(path.join(app.dir.project, 'docs.json'), (err, data) => {
    //     if (err) {
    //       console.log(err)
    //     }
    //
    //     data = JSON.parse(data + '')
    //     app.locals.nav = data.nav
    //     app.locals.pages = data.pages
    //
    //     console.log(data.pages.home.page.header.markdown.split('\n'))
    //
    //     res.render('index', getData(req.path))
    //   })
    // }, 10)

    res.render('index', getData(req.path))
  }


  fs.readdirSync(__dirname)
    .forEach((controller) => {
      // set the key to the controller then require it
      let key = controller.replace(/\.js$/, '')
      // require the controller as long as it is not index.js because that is the one we are in
      if (key !== 'index') {
        controlls[key] = require(path.join(__dirname, key)).default(app)
      }
    })
  return controlls
}
