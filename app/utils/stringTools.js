export function truncateChars(input, chars, breakOnWord) {
  if (isNaN(chars)) return input
  if (chars <= 0) return ''
  if (input && input.length > chars) {
    input = input.substring(0, chars)

    if (!breakOnWord) {
      let lastSpace = input.lastIndexOf(' ')

      // Get last space
      if (lastSpace !== -1)
        input = input.substr(0, lastSpace)

    } else {
      while (input.charAt(input.length - 1) === ' ') {
        input = input.substr(0, input.length - 1)
      }
    }

    return input + '...'
  }

  return input
}

export function truncateWords(input, words) {
  if (isNaN(words)) return input
  if (words <= 0) return ''
  if (input) {
    let inputWords = input.split(/\s+/)

    if (inputWords.length > words)
      input = inputWords.slice(0, words).join(' ') + '...'

    return input
  }
}

export function capitalize(input) {
  return input.charAt(0).toUpperCase() + input.slice(1)
}

// A missing value (undefined or null) as '', so a field whose
// value it is stays controlled.
export function orEmpty(input) {
  return input === undefined || input === null ? '' : input
}
