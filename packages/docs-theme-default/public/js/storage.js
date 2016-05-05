let storage = {}
storage.set = (key, value) => localStorage.setItem(`docs-${key}`, JSON.stringify(value, null, 2))
storage.get = (key) => JSON.parse(localStorage.getItem(`docs-${key}`))
storage.remove = (key) => localStorage.removeItem(`docs-${key}`)
storage.keys = () => {
  return Object.keys(localStorage).filter((key) => key.indexOf('docs-') > -1)
}
storage.has = storage.exists = (key) => storage.keys().indexOf(`docs-${key}`) > -1

export default storage
