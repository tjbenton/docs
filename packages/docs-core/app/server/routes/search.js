export default function search(app, router, controllers) {
  app.get('/search', controllers.search.index)
  app.get('/s', controllers.search.index)
  return router
}
