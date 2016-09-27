$script('copied')
$script('settings')
$script('toggle')

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

$script('cash', () => {
  if ($('.js-frame').length) {
    $script('iframe')
  }
})
