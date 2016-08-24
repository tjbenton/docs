$(document).on('click', '.js-toggle__trigger', function ToggleTrigger(e) {
  e.preventDefault()
  var $obj = $(this)
  var $text_data = $obj.data('text')
  if ($text_data) {
    $obj.data('text', $obj.text()).text($text_data)
  }
  $obj.closest('.js-toggle').toggleClass($obj.data('state') || 'is-active')
})
