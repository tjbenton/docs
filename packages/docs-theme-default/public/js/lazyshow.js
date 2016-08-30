class LazyShow { // eslint-disable-line
  constructor(options = {}) {
    if (typeof options === 'string') {
      options = { selector: options }
    }

    this.options = Object.assign({
      container: document, // container to observer for changes
      selector: 'js-lazyshow', // the class to look for
      threshold: 20, // how close can the element be to be considered visible
      // event to watch for to see when an element becomes visible. The event bubbles
      // up so it's recommened to set it on the container you're targeting
      visible: 'lazy.visible',
      check: 'lazy.check', // event to trigger a check
      added: 'lazy.added',
      callback: undefined // if you don't want to use an event listener then you can just run a callback
    }, options)

    // console.log((this.options.threshold / 100) * window.innerHeight)

    // ensures there's not a `.` in the passed selector
    this.options.selector = this.options.selector.replace('.', '')

    // defines out the initial nodes list when the function is called.
    this.nodes = [].slice.call(this.options.container.getElementsByClassName(this.options.selector))

    // used to check if the container was set to window || document
    this.has_tag = !!this.options.container.tagName

    // placeholder to store the current containers height
    this.container_height = 0

    // placeholder container that is used to check the container's height.
    // it's stored here so this check only has to happen once. Instead of
    // every time the update function get's called.
    this._container = this.has_tag ? this.options.container : window

    // stores the last known scroll position
    this.last_y = 0
    this.last_x = 0

    // determins if the requestAnimationFrame should continue running or not
    this.ticking = false

    // a) use the container to get the last scroll
    // b) use the window to get the last scroll
    // The reason why this is conditionally set here instead of it's own function
    // is so that every time request scroll gets called it doesn't have to check
    // if the container has a tag.
    if (this.has_tag) {
      this.requestUpdate = () => {
        this.last_y = this.options.container.scrollTop + this.getOffset(this.options.container)
        this.last_x = this.options.container.scrollLeft + this.getOffset(this.options.container, 'left')
        this.tick()
      }
    } else {
      this.requestUpdate = () => {
        this.last_y = window.pageYOffset
        this.last_x = window.pageXOffset
        this.tick()
      }
    }

    // this handler is used to bind this instance of LazyShow to the requestUpdate
    this.handler = this.requestUpdate.bind(this)

    // this sets the custom event to look for
    // when an element become visible
    this.events = {
      check: this.createEvent(this.options.check),
      visible: this.createEvent(this.options.visible),
      added: this.createEvent(this.options.added)
    }

    // bind scroll and resize event
    this.listeners()

    // Runs the Observer to watch for changes.
    this.observer()
  }

  /// @name set_custom_event
  /// @description Used to set the a custom even to look for
  createEvent(event, bubbles = true) {
    let custom_event
    // a) Browser is normal
    // b) Browser sucks and is probably IE
    if (window.CustomEvent) {
      custom_event = new CustomEvent(event, {
        bubbles
      })
    } else {
      console.log('Come on IE, really bro?')
      custom_event = document.createEvent('CustomEvent')
      custom_event.initCustomEvent(event, true, true, {
        bubbles
      })
    }

    return custom_event
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  debounce(func, wait, immediate) {
    let timeout
    return function Callback(...args) {
      let callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        timeout = null
        !immediate && func.apply(this, args)
      }, wait)
      callNow && func.apply(this, args)
    }
  }

  getOffset(node, side = 'top') {
    return node.getBoundingClientRect()[side] + window[side === 'top' ? 'pageYOffset' : 'pageXOffset']
  }

  tick() {
    if (!this.ticking) {
      requestAnimationFrame(this.check.bind(this))
      this.ticking = true
    }
  }

  listeners(type = 'add') {
    // store the current state of the listeners so the mutation observer
    // knows if it needs to add the listeners or not.
    this.listening = type === 'add'

    type = `${type.toLowerCase()}EventListener`

    // add/remove event's for the initial page load
    for (const event of [ 'DOMContentLoaded', 'load' ]) {
      window[type](event, this.handler, false)
    }

    // add/remove event's that occur when the screen changes sizes or
    // the url gets updated without a page load
    for (const event of [ 'resize', 'orientationchange', 'hashchange' ]) {
      window[type](event, this.handler, false)
    }

    // add/remove event's that can be added to container
    for (const event of [ 'scroll', this.options.check ]) {
      this.options.container[type](event, this.handler, false)
    }

    // a) Add event listener to trigger the callback defined in the options.
    if (!!this.options.callback) {
      // set an event listener for the custom event that is triggered when
      // an element becomes visible.
      this.options.container
        .addEventListener(this.options.namespace, (e) => this.options.callback.call(e.target))
    }
  }

  on(event, callback) {
    this._container.addEventListener(this.options[event] || event, (e) => callback.call(e.target, e))
    return this
  }

  isVisible(node, threshold) {
    threshold = threshold || this.options.threshold
    return this.isVisibleVertical(node, threshold)
  }

  isVisibleVertical(node, threshold) {
    threshold = threshold || this.options.threshold
    // get node top and bottom offset. (remember, getBoundingClientRect is relative to the viewport)
    let top = this.getOffset(node)

    // return true if node in viewport
    return (
      (top + this.container_height >= this.last_y - threshold) && // bottom
      (top <= (this.last_y + this.container_height) + threshold) // top
    )
  }

  isVisibleHorizontal(node, threshold) {
    threshold = threshold || this.options.threshold
    // get node left offset. (remember, getBoundingClientRect is relative to the viewport)
    let left = this.getOffset(node, 'left')

    // return true if node in viewport
    return (
      (left + this.container_width >= this.last_x - threshold) && // right
      (left <= (this.last_x + this.container_width) + threshold) // left
    )
  }

  /// @name isHidden
  /// @description
  /// Helper function to see if an element hidden via it's styles. It's used because of responsive sites.
  /// @markup {js}
  /// if(!isHidden(somenode)){
  ///  // do something with the node that is not hidden
  /// }
  isHidden(node) {
    let style = window.getComputedStyle(node, null)
    return style.getPropertyValue('visible') === 'hidden' || style.getPropertyValue('display') === 'none'
  }

  /// @name check
  /// @description
  /// This will check if an element is visible or within the threshold that was passed.
  /// It can be triggered via `document.dispatchEvent("lazy.check")
  check() {
    let not_visible = [] // stores nodes that still aren't visible
    let nodes_length = this.nodes.length

    // set the container height so it can be used in `isVisible`
    this.container_height = this._container.innerHeight || this._container.offsetHeight
    this.container_width = this._container.innerWidth || this._container.offsetWidth

    // a) loop over each node in the list and check if they're visible
    if ((this.has_tag ? !this.isHidden(this.options.container) : true) && nodes_length) {
      // loop through nodes in the current nodes list
      for (let i = 0; i < nodes_length; i++) {
        let node = this.nodes[i]
        // check if node in viewport
        // a) trigger the custom callback on that node
        // b) add the item to the `not_visible` array
        !this.isHidden(node) && this.isVisible(node) ? node.dispatchEvent(this.events.visible) : not_visible.push(node)
        node.dispatchEvent(this.events.check)
      }

      // update `this.nodes` to be the new array of items that
      // aren't visible yet
      this.nodes = not_visible
    }

    // If the nodes length is `0` then remove event listeners
    !!nodes_length || setTimeout(() => this.listeners('remove'), 2000)

    // allow for more animation frames
    this.ticking = false
  }

  add(node) {
    if (this.nodes.indexOf(node) < 0) {
      this.nodes.push(node)
      node.dispatchEvent(this.events.added)
    }
  }

  // mutation observer to add nodes to the list
  observer() {
    const MutationObserver = 'MutationObserver'
    const Observer = window[MutationObserver] || window[`WebKit${MutationObserver}`] || window[`Moz${MutationObserver}`]
    // 1. placeholder for the nodes that were added
    // 2. placeholder for each node that was added
    // 3. placeholder for children elements that have a class of `this.options.selector`

    this.nodes.forEach((node) => this.add(node))

    let children_nodes

    return Observer && new Observer((mutations) => {
      // loop over each mutation event
      for (let mutation of mutations) {
        // loop over each of the nodes that were added
        for (let added_node of mutation.addedNodes) {
          // determins if one of the observed elements/elements.children had an element that was added.
          let was_added = false

          // push the node that was added to the page
          if ((added_node.className || '').split(' ').indexOf(this.options.selector) > -1) {
            was_added = true
            this.add(added_node)
          }

          children_nodes = []
          // get any children elements that have the selector and
          if (added_node.getElementsByClassName) {
            children_nodes = [].slice.call(added_node.getElementsByClassName(this.options.selector))
          }

          // add them to the nodes list, and dispatch
          // the added event
          for (let child of children_nodes) {
            this.add(child)
          }

          // a) An element that matches the selector was added
          if (was_added || !!children_nodes.length) {
            // a) add event listeners back to the window and container
            if (!this.listening) {
              this.listeners()
            }

            this._container.dispatchEvent(this.events.check)
          }
        }
      }

      if (this.nodes.length) {
        console.log('%s nodes were added', this.nodes.length)
      }
    })
    .observe(this.options.container, {
      childList: true,
      characterData: true,
      subtree: true
    })
  }
}
