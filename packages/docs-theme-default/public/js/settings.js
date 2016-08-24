/* global $ */
/* eslint-disable prefer-arrow-callback, func-names */
$(function() {
  var $root = $('html')
  var $settings = $('.js-settings')
  var settings = JSON.parse(localStorage.getItem('settings'))
  if (!settings) {
    settings = {}
    $settings.find('input').each(function(obj) {
      settings[obj.value] = obj.checked
    })

    localStorage.setItem('settings', JSON.stringify(settings, null, 2))
  }

  $settings.on('change', '.js-settings__setting', function PageSettingChange() {
    settings[this.value] = this.checked
    localStorage.setItem('settings', JSON.stringify(settings, null, 2))
    toggleSetting(this.value)
  })

  for (var setting in settings) {
    if (settings.hasOwnProperty(setting)) {
      var $obj = $settings.find('.js-settings__setting[value=' + setting + ']')
      settings[setting] ? $obj.attr('checked') : $obj.removeAttr('checked')
      toggleSetting(setting)
    }
  }

  function toggleSetting(name) {
    if (settings[name]) {
      $root.addClass('has-' + name)
      $root.removeClass('has-no-' + name)
    } else {
      $root.addClass('has-no-' + name)
      $root.removeClass('has-' + name)
    }
  }
})
