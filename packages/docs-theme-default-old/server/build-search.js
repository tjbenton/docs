import lunr from 'lunr'
import fs from 'fs'
import path from 'path'

export default function buildSearch(data) {
  const index = lunr()
  const keys = []
  // helper function to add items to the search index
  const addToIndex = (obj) => {
    // flatten the object so it can be searched through
    obj = flattenObject(obj)

    // add the keys of the flatten objected to the search index if it doesn't exist
    Object.keys(obj).forEach((key) => {
      if (keys.indexOf(key) < 0) {
        keys.push(key)
        index.field(key)
      }
    })

    index.add(obj)
  }


  for (let file in data) {
    if (data.hasOwnProperty(file)) {
      let header = data[file].header
      header.id = `${file}:header`
      addToIndex(header)

      let body = data[file].body
      for (let i = 0; i < body.length; i++) {
        let token = body[i]
        // set the id to be the file path the type and the item that matched
        token.id = `${file}:body:${i}`
        addToIndex(token)
      }
    }
  }

  const json = `module.exports = ${JSON.stringify(index)}`

  fs.writeFile(path.join(process.cwd(), 'public', 'search_index.js'), json, (err) => {
    if (err) {
      throw err
    }
  })
}


function flattenObject(obj) {
  let result = {}

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if ((typeof obj[key]) === 'object') {
        let flattenObj = flattenObject(obj[key])
        for (let x in flattenObj) {
          if (flattenObj.hasOwnProperty(x)) {
            result[key + '.' + x] = flattenObj[x]
          }
        }
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}
