$script('cash', () => {
  let settings = JSON.parse(localStorage.getItem('settings')) || {}
  let keys = Object.keys(settings)
  const $root = $(document.documentElement)
  const $container = $root.find('.js-settings')
  const $settings = $container.find('.js-settings__setting')

  if (!keys.length) {
    $settings.each((obj) => update(obj, obj.checked))
  } else {
    $settings.each((obj) => update(obj, settings[obj.value]))
  }

  $container.on('change', '.js-settings__setting', (e) => {
    update(e.target, e.target.checked)
    if (window.lazy_iframify) {
      window.lazy_iframify.check()
    }
  })

  if (settings) {
    keys.forEach(updateRoot)
  }

  function update(obj, state) {
    const name = obj.value
    settings[name] = state = state !== undefined ? state : settings[name]
    obj.checked = state
    updateRoot(name)
    localStorage.setItem('settings', JSON.stringify(settings, null, 2))
  }

  function updateRoot(name) {
    if (settings[name]) {
      $root.addClass('has-' + name)
      $root.removeClass('has-no-' + name)
    } else {
      $root.addClass('has-no-' + name)
      $root.removeClass('has-' + name)
    }
  }
})
