/// @name Async Suite
/// @description
/// This is function is used to create async suites for mocha
/// @arg {string} name - the name of the suite
async function asyncSuite(name, ...callbacks) {
  let result

  try {
    for (let callback of callbacks) {
      callback = callback(result)

      result = await (callback && callback.then ? callback : Promise.resolve(callback)) // eslint-disable-line
      // if (callback) {
      // } else {}
    }
  } catch (err) {
    console.log(err)
  }

  suite(name, result)

  // run mocha-tests
  run() // eslint-disable-line
}

asyncSuite.wrap = (name, callback) => {
  asyncSuite(name, () => callback)
}


export default asyncSuite
