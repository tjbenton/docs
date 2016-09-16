const iframify_requires = [
  'cash',
  'lazyshow',
  'pseudo-styles',
  'iframeResizer.contentWindow',
  'iframeResizer',
  'iframify',
  'copied'
]

if (!('srcdoc' in document.createElement('iframe'))) {
  iframify_requires.push('srcdoc-polyfill')
}

$script(iframify_requires, () => {
  const lazy = window.lazy_iframify = new LazyShow('js-iframify')
  const options = iframify_options || {}
  const $doc = $(document)
  const extras = `
    <script>
      window.top.pseudoStyles(window)
      // this might need to be updated to use '\${iframeResizerContentWindow.toString()};'
      // because during development some cases this way froze the page.
      window.top.iframeResizerContentWindow(window)
    </script>
  `

  lazy.on('visible', function Visible() {
    const $obj = $(this)
    const html = $obj.text()
    $obj.html('')
    let iframe = $('<div class="c-frame__iframe"></div>')[0]
    $obj.append(iframe)
    iframe = iframify(iframe, $.extend({}, options, {
      stylesSelector: 'nothing',
      sizingTimeout: 1000,
      bodyExtra: [
        html,
        options.bodyExtra,
        extras
      ].filter(Boolean).join('\n')
    }))

    const $iframe = $(iframe)
      .removeClass('js-iframify')
      .addClass('js-iframe-resize')

    $iframe.on('load', () => {
      iFrameResize({
        checkOrigin: false,
        minSize: 50,
        resizedCallback() {
          $iframe
            .parent()
            .addClass('u-lazy--in')
            .parent()
            .removeClass('u-loading u-loading--middle u-loading--huge is-loading')
          lazy.check()
        }
      }, iframe)
    })
  })

  $doc.on('click', '.js-frame .js-frame__view-state', function ViewState(e) {
    e.preventDefault()
    const $obj = $(this)
    const id = $obj.parent().data('index')

    $obj
      .closest('.js-frame')
      .find('.js-frame__section[data-type=escaped-state]')
      .each((item) => {
        const $item = $(item)
        const test = $item.data('index') === id
        $item
          .toggleClass('u-show', test)
          .toggleClass('u-hide', !test)
      })
  })

  $doc.on('click', '.js-frame__copy', function CopyToClipBoardButton(e) {
    e.preventDefault()
    const $frame = $(this).parents('.js-frame')
    const $code = $frame
      .find('.js-frame__section[data-type^="escape"]')
      // filters out hidden items
      .filter((elem) => !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length))
      .find('code')
      .first()
    if ($code.length) {
      copy($code)
    }
  })
})
