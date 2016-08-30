/* eslint-disable func-names, prefer-arrow-callback */
/* global iframify, iframify_options, LazyShow */
$(() => {
  const lazy = new LazyShow('js-iframify')
  const options = iframify_options || {}
  lazy.on('visible', function Visible() {
    const $obj = $(this)
    const html = $obj.text()
    $obj.html('')
    const $iframe = $(iframify(this, $.extend({}, options, {
      stylesSelector: 'nothing',
      sizingTimeout: 1000,
      bodyExtra: html + '\n' + (options.bodyExtra || '')
    })))
    $iframe.addClass('c-frame__iframe u-lazy u-lazy--fade')
    $iframe.on('load', () => {
      $iframe
        .addClass('u-lazy--in')
        .parent()
        .removeClass('u-loading u-loading--middle u-loading--huge is-loading')
    })
  })
})
