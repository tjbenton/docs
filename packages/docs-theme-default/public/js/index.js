$script('copied')
$script('settings')

// /* global pageAccelerator */
// holding off on this for now because it breaks other js on the page
// $script([ 'page-accelerator', 'cash' ], () => {
//   const $html = $('html')
//   pageAccelerator('.js-page-accelerator', {
//     pre() {
//       $html.addClass('u-loading u-loading--middle u-loading--huge is-loading')
//     },
//     post() {
//       if (window.lazy_iframify) {
//         window.lazy_iframify.check()
//       }
//
//       $html.removeClass('u-loading u-loading--middle u-loading--huge is-loading')
//
//
//       $(document).trigger('$script')
//     }
//   })
// })

$script([ 'cash', 'toggle' ], () => {
  if ($('.js-frame').length) {
    $script('iframe')
  }

  const $menu = $('.js-nav-menu')

  $menu.on('click', '.js-toggle__trigger', function MenuToggle() {
    const $obj = $(this)
    const $list = $obj.closest('.c-list')
    setTimeout(() => {
      const has_active = $list.children('.is-active').length
      $list
        .toggleClass('has-active', has_active)
        .siblings('.c-list')
        .toggleClass('has-active', has_active)

      if (!has_active) {
        $list
          .find('.is-active, .has-active')
          .removeClass('is-active has-active')
      }
    })
  })

  // changes the menu to show what's on the current page
  setTimeout(() => {
    const loc = location.pathname.replace(/^\/|\/$/g, '').split('/')
    const selectors = loc.map((str, i) => `[href='/${loc.slice(0, i + 1).join('/')}'].js-toggle__trigger`).join(', ')
    $menu.find(selectors).trigger('click')
  }, 100)
})
