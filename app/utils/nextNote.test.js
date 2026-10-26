import { describe, it, expect } from 'vitest'

import nextNote from 'utils/nextNote'

const note = (_id, notebookId, createdAt) =>
  ({ _id, notebookId, createdAt })

describe('nextNote', () => {
  it('picks the newest note of the notebook', () => {
    const notes = [
      note('old', 'nb1', new Date('2018-01-01')),
      note('new', 'nb1', new Date('2018-03-01')),
      note('mid', 'nb1', new Date('2018-02-01'))
    ]

    expect(nextNote(notes, 'nb1')._id).toBe('new')
  })

  it('accepts createdAt as a string, as after IPC', () => {
    const notes = [
      note('old', 'nb1', '2018-01-01T00:00:00.000Z'),
      note('new', 'nb1', '2018-03-01T00:00:00.000Z')
    ]

    expect(nextNote(notes, 'nb1')._id).toBe('new')
  })

  it('ignores notes from other notebooks', () => {
    const notes = [
      note('mine', 'nb1', new Date('2018-01-01')),
      note('other', 'nb2', new Date('2018-06-01'))
    ]

    expect(nextNote(notes, 'nb1')._id).toBe('mine')
  })

  it('returns undefined when the notebook has no notes', () => {
    const notes = [note('other', 'nb2', new Date('2018-06-01'))]

    expect(nextNote(notes, 'nb1')).toBeUndefined()
    expect(nextNote([], 'nb1')).toBeUndefined()
  })
})
