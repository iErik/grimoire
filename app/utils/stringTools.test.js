import { describe, it, expect } from 'vitest'

import {
  truncateChars,
  truncateWords,
  capitalize
} from 'utils/stringTools'

describe('truncateChars', () => {
  it('returns short input unchanged', () => {
    expect(truncateChars('hello', 10)).toBe('hello')
  })

  it('returns input of exactly the limit unchanged', () => {
    expect(truncateChars('hello', 5)).toBe('hello')
  })

  it('cuts back to the last word boundary by default', () => {
    expect(truncateChars('hello brave world', 13))
      .toBe('hello brave...')
  })

  it('keeps a cut word when there is no space to cut back to', () => {
    expect(truncateChars('abcdefghij', 4)).toBe('abcd...')
  })

  it('cuts mid-word when breakOnWord is set', () => {
    expect(truncateChars('hello brave world', 9, true))
      .toBe('hello bra...')
  })

  it('drops trailing spaces when breakOnWord is set', () => {
    expect(truncateChars('hello   world', 8, true))
      .toBe('hello...')
  })

  it('returns the input when the limit is not numeric', () => {
    expect(truncateChars('hello world', 'abc')).toBe('hello world')
    expect(truncateChars('hello world')).toBe('hello world')
  })

  it('returns an empty string for a zero or negative limit', () => {
    expect(truncateChars('hello', 0)).toBe('')
    expect(truncateChars('hello', -3)).toBe('')
  })

  it('passes empty and undefined input through', () => {
    expect(truncateChars('', 5)).toBe('')
    expect(truncateChars(undefined, 5)).toBeUndefined()
  })
})

describe('truncateWords', () => {
  it('returns input within the word limit unchanged', () => {
    expect(truncateWords('one two three', 3)).toBe('one two three')
  })

  it('keeps the first words and appends an ellipsis', () => {
    expect(truncateWords('one two three four', 2))
      .toBe('one two...')
  })

  it('splits on any run of whitespace', () => {
    expect(truncateWords('one \n two\t\tthree', 2))
      .toBe('one two...')
  })

  it('counts trailing whitespace as an extra empty word', () => {
    expect(truncateWords('one two ', 2)).toBe('one two...')
    expect(truncateWords('one two ', 3)).toBe('one two ')
  })

  it('returns the input when the limit is not numeric', () => {
    expect(truncateWords('one two', 'abc')).toBe('one two')
    expect(truncateWords('one two')).toBe('one two')
  })

  it('returns an empty string for a zero or negative limit', () => {
    expect(truncateWords('one two', 0)).toBe('')
    expect(truncateWords('one two', -1)).toBe('')
  })

  it('returns undefined for empty or undefined input', () => {
    expect(truncateWords('', 2)).toBeUndefined()
    expect(truncateWords(undefined, 2)).toBeUndefined()
  })
})

describe('capitalize', () => {
  it('uppercases the first character', () => {
    expect(capitalize('grimoire')).toBe('Grimoire')
  })

  it('leaves the rest of the string as it is', () => {
    expect(capitalize('hELLO wORLD')).toBe('HELLO wORLD')
  })

  it('leaves an already capitalized string unchanged', () => {
    expect(capitalize('Notebook')).toBe('Notebook')
  })

  it('returns an empty string for empty input', () => {
    expect(capitalize('')).toBe('')
  })

  it('throws on undefined input', () => {
    expect(() => capitalize(undefined)).toThrow(TypeError)
  })
})
