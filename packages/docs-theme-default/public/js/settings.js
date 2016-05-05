import $ from 'cash'
import storage from './storage'

$(() => {
  const $root = $('html')
  const $settings = $('.docs-js-settings')
  let settings = storage.get('settings')
  if (!settings) {
    settings = {}
    $settings.find('input').each((obj) => {
      settings[obj.value] = true
    })
    storage.set('settings', settings)
  }

  $settings.on('change', '.docs-js-settings__setting', function PageSettingChange() {
    const { checked, value: name } = this
    settings[name] = checked
    storage.set('settings', settings)
    toggleSetting(name)
  })

  for (let name in settings) {
    if (settings.hasOwnProperty(name)) {
      $settings
        .find(`.docs-js-settings__setting[value='${name}']`)
        .attr('checked', settings[name])
      toggleSetting(name)
    }
  }

  function toggleSetting(name) {
    $root.toggleClass(`docs-has-${name}`, settings[name])
  }
})
