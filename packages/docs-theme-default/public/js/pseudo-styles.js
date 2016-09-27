// Pseudo Styles
// Scans your stylesheets for pseudo classes and adds a class with the same name.
// Compile regular expression.
// To use these styles just add the psudo class to the element like this.
// ```
//  <a href="#" class="btn :hover">Button</a>
// ```
function pseudoStyles(root = window) { // eslint-disable-line
  const doc = root.document

  // https://github.com/mathiasbynens/CSS.escape/blob/master/css.escape.js
  /* eslint-disable */
  root.CSS.escape = (root.CSS || {}).escape || function escape(value) { // eslint-disable-line
    if (arguments.length === 0) {
      throw new TypeError('`CSS.escape` requires an argument.');
    }
    var string = String(value);
    var length = string.length;
    var index = -1;
    var codeUnit;
    var result = '';
    var firstCodeUnit = string.charCodeAt(0);
    while (++index < length) {
      codeUnit = string.charCodeAt(index);
      // Note: there’s no need to special-case astral symbols, surrogate
      // pairs, or lone surrogates.

      // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
      // (U+FFFD).
      if (codeUnit == 0x0000) {
        result += '\uFFFD';
        continue;
      }

      if (
        // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
        // U+007F, […]
        (codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
        // If the character is the first character and is in the range [0-9]
        // (U+0030 to U+0039), […]
        (index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
        // If the character is the second character and is in the range [0-9]
        // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
        (
          index == 1 &&
          codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
          firstCodeUnit == 0x002D
        )
      ) {
        // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
        result += '\\' + codeUnit.toString(16) + ' ';
        continue;
      }

      if (
        // If the character is the first character and is a `-` (U+002D), and
        // there is no second character, […]
        index == 0 &&
        length == 1 &&
        codeUnit == 0x002D
      ) {
        result += '\\' + string.charAt(index);
        continue;
      }

      // If the character is not handled by one of the above rules and is
      // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
      // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
      // U+005A), or [a-z] (U+0061 to U+007A), […]
      if (
        codeUnit >= 0x0080 ||
        codeUnit == 0x002D ||
        codeUnit == 0x005F ||
        codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
        codeUnit >= 0x0041 && codeUnit <= 0x005A ||
        codeUnit >= 0x0061 && codeUnit <= 0x007A
      ) {
        // the character itself
        result += string.charAt(index);
        continue;
      }

      // Otherwise, the escaped character.
      // https://drafts.csswg.org/cssom/#escape-a-character
      result += '\\' + string.charAt(index);

    }
    return result;
  };

  /* eslint-enable */

  let pseudos = [
    'active', 'blank', 'checked', 'default', 'disabled',
    'empty', 'enabled', 'first-child', 'first-letter',
    'first-line', 'first-of-type', 'focus', 'hover',
    'in-range', 'invalid', 'last-child', 'last-of-type',
    'link', 'marker', 'only-child', 'only-of-type',
    'optional', 'out-of-range', 'placeholder-shown',
    'placeholder', 'read-only', 'read-write', 'required',
    'selection', 'target', 'valid', 'visited',
  ]
  // let pseudo_regex = new RegExp(':((' + pseudos.join(')|(') + '))', 'gi')
  let pseudo_regex = new RegExp(':(' + pseudos.join('|') + ')', 'gi')

  function createStylesheet(href) {
    var style = doc.createElement('style')
    style.className = 'js-psudeo-styles'
    if (href) {
      style.setAttribute('data-parent', href)
    }
    // WebKit hack :(
    style.appendChild(doc.createTextNode(''))

    // Add the <style> element to the page
    doc.body.appendChild(style)
    return style.sheet
  }

  return [].slice.call(doc.styleSheets)
    .map((sheet) => {
      if (!sheet.cssRules) {
        return false
      }

      const stylesheet = createStylesheet()

      ;[].slice.call(sheet.cssRules)
        // Keep only rules with pseudo classes.
        .filter((rule) => rule.selectorText && rule.selectorText.match(pseudo_regex))
        .map(({ selectorText, style }) => {
          selectorText = selectorText
            .split(/,\s*/g)
            .reduce((prev, selector) => {
              let selectors = [ ]
              if (selector.indexOf(':') > -1) {
                selectors.push(selector.replace(pseudo_regex, `.${CSS.escape(':')}$1`))
              }
              selectors.push(CSS.escape(selector.replace('.', '__TEMP__')).replace('__TEMP__', '.'))
              selectors.push(`.${CSS.escape(selector)}`)

              return [].concat(prev, selectors)
            }, [])
            .filter((item, i, array) => array.indexOf(item, i + 1) < 0)
            .join(',\n')
          return {
            selector: selectorText,
            rules: style.cssText
          }
        })
        .forEach((obj, i) => {
          let { selector, rules } = obj
          if (stylesheet.insertRule) {
            stylesheet.insertRule(selector + '{' + rules + '}', i)
          } else {
            stylesheet.addRule(selector, rules, i)
          }
        })

      return stylesheet
    })
}
