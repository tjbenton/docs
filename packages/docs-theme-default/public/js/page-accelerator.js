/*
  * PageAccelerator - A solution to load web pages faster
  * http://github.com/EasyFood/PageAccelerator
  * author: Evandro Leopoldino Goncalves <evandrolgoncalves@gmail.com>
  * http://github.com/EasyFood
  * License: MIT
*/
(function(global, doc) { // eslint-disable-line
  if (!Promise) {
    console.log("Promises aren't supported")
    return
  }

  {
    const el = Element.prototype
    el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector
  }

  function PageAccelerator(selector = '', callbacks) {
    this.url = doc.location.href

    if (typeof selector !== 'string') {
      callbacks = selector
      selector = ''
    }

    this.callbacks = {
      pre() {},
      post() {
        global.scrollTo(0, 0)
      }
    }

    if (typeof callbacks === 'object') {
      if (callbacks.pre) {
        this.callbacks.pre = callbacks.pre
      }
      if (callbacks.post) {
        this.callbacks.post = callbacks.post
      }
    } else if (typeof callbacks === 'function') {
      this.callbacks = {
        post: callbacks
      }
    }

    this.selector = selector || 'a:not([data-pageAccelerator="false"]):not([data-page-accelerator="false"])'
  }

  const ajax = {
    get(url) {
      return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest()
        req.open('GET', url, true)

        req.onload = () => {
          if (req.status >= 200 && req.status < 400) {
            resolve(req.response)
            return
          }

          reject(req.response)
        }

        req.onerror = () => {
          reject(Error('Network Error'))
        }

        req.send()
      })
    }
  }

  PageAccelerator.prototype = {
    updateObject(obj, body) {
      let attrs = body.attributes

      for (let i = 0, size = attrs.length; i < size; i++) {
        obj.attrs[attrs[i].name] = attrs[i].value
      }

      return obj
    },

    updateHistory(head, body) {
      var obj = this.updateObject({
        head: head.innerHTML.trim(),
        content: body.innerHTML.trim(),
        attrs: {}
      }, body)

      global.history.pushState(obj, '', this.url)
      global.addEventListener('popstate', this.updateBody.bind(this), false)
    },

    domParser(data) {
      var parser = new DOMParser()
      return parser.parseFromString(data, 'text/html')
    },

    updateBodyAttributes(data) {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          doc.body.attr(key, data[key])
        }
      }
    },

    updateBody(e) {
      var data = e.state
      if (!data) {
        return
      }
      this.updateBodyAttributes(data.attrs)
      doc.body.innerHTML = data.content

      var dom = this.domParser(data.head)
      doc.title = dom.head.querySelector('title').innerText

      this.url = global.location.href
    },

    update(data) {
      let dom = this.domParser(data)
      let head = dom.head

      return Promise.all([].map.call(head.querySelectorAll('link[rel="stylesheet"]'), (element) => ajax.get(element.href)))
        .then(() => {
          var body = dom.body
          doc.body = body
          doc.head = head
          doc.title = head.querySelector('title').innerText

          return this.updateHistory(head, body)
        })
    },

    replaceHistory() {
      const body = doc.body
      const obj = this.updateObject({
        head: doc.head.innerHTML.trim(),
        content: body.innerHTML.trim(),
        attrs: {}
      }, body)

      global.history.replaceState(obj, '', this.url)
    },

    listener() {
      document.addEventListener('click', (e) => {
        const element = e.target
        if (
          element &&
          element.hostname === global.location.hostname &&
          element.protocol === global.location.protocol &&
          element.href[0] !== '#' &&
          element.matches(this.selector)
        ) {
          this.callbacks.pre(element)
          e.preventDefault()
          this.url = element.href
          ajax
            .get(this.url)
            .then(this.update.bind(this))
            .then(this.callbacks.post)
            .catch(this.update.bind(this))

          this.replaceHistory()
        }
      }, false)
    },

    start() {
      this.listener()
      this.replaceHistory()
    }
  }

  global.pageAccelerator = (selector, callback) => {
    new PageAccelerator(selector, callback).start()
  }
}(window, document))
