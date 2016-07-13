import $ from 'cash'

$(() => {
  const $document = $(document)
  $document.on('copy', (e) => {
    let $obj = $(e.target)
    if (!$obj.hasClass('docs-js-frame')) {
      $obj = $obj.parents('.docs-js-frame')
    }
    if ($obj.length) {
      e.preventDefault()
      let content = window.getSelection().toString()
      if (!content) {
        content = $obj.text()
      }

      // trim trailing spaces of each line
      content = content.replace(/^(.*)\s*$/gm, '$1')

      e.clipboardData.setData('text/plain', content)
    }
  })

  $document.on('click', '.docs-js-frame__section', function CopyToClipBoard(e) {
    if (e.detail === 4) {
      const type = this.getAttribute('data-type')

      if (type === 'escaped' || type === 'escaped-stateless') {
        copy(this.querySelector('.hljs'))
      }
    }
  })

  $document.on('click', '.docs-js-frame__copy', function CopyToClipBoardButton(e) {
    e.preventDefault()
    const $obj = $(this)
      .parents('.docs-js-frame')
      .find('.docs-js-frame__section .hljs')[0]

    if ($obj) {
      copy($obj)
    }
  })

  window.$ = $
})


function selectContent(obj) {
  if (window.getSelection && document.createRange) {
    let sel = window.getSelection()
    let range = document.createRange()
    range.selectNodeContents(obj)
    sel.removeAllRanges()
    sel.addRange(range)
  } else if (document.selection && document.body.createTextRange) {
    let textRange = document.body.createTextRange()
    textRange.moveToElementText(obj)
    textRange.select()
  }
}

function copy(obj) {
  try {
    if (obj !== undefined) {
      selectContent(obj)
    }
    document.execCommand('copy')
    // clears the current selection
    window.getSelection().removeAllRanges()
  } catch (err) {
    console.log(err)
  }
}
