$script('cash', () => {
  const $doc = $(document)

  $doc.on('copy', (e) => {
    e.preventDefault()
    let $obj = $(e.target)
    $obj = $obj.is('.js-copied') ? $obj : $obj.closest('.js-copied')
    let content = window.getSelection().toString()
    if ($obj.length) {
      const $content = $obj.find('.js-copied__content')

      if (!content) {
        content = $content.text()
      }

      $content.one('animationend webkitAnimationEnd', () => {
        $obj.removeClass('is-copied')
      })
      $obj.addClass('is-copied')
    }

    // trim trailing spaces of each line
    content = content.replace(/ +$/gm, '')
    e.clipboardData.setData('text/plain', content)
  })
})


function selectContent(obj) {
  if (
    obj.tagName === 'INPUT' ||
    obj.tagName === 'TEXTAREA'
  ) {
    obj.select()
  } else if (
    window.getSelection &&
    document.createRange
  ) {
    const sel = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(obj)
    sel.removeAllRanges()
    sel.addRange(range)
  } else if (
    document.selection &&
    document.body.createTextRange
  ) {
    const range = document.body.createTextRange()
    range.moveToElementText(obj)
    range.select()
  }
}

function copy(obj) { // eslint-disable-line
  if (typeof obj === 'undefined') {
    return
  } else if (!obj.tagName) {
    obj = [].slice.call(obj)[0]
  }
  try {
    selectContent(obj)
    document.execCommand('copy')
    // clears the current selection
    window.getSelection().removeAllRanges()
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
