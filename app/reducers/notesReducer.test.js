import { describe, it, expect } from 'vitest'

import notesReducer from 'reducers/notesReducer'

const note = (id, notebookId, createdAt) => ({
  _id: id,
  notebookId,
  title: `Note ${id}`,
  createdAt
})

const older = note('n1', 'nb1', '2018-01-01T00:00:00Z')
const newer = note('n2', 'nb1', '2018-02-01T00:00:00Z')
const newest = note('n3', 'nb1', '2018-03-01T00:00:00Z')
const elsewhere = note('n4', 'nb2', '2018-04-01T00:00:00Z')

const stateWith = (notes, selectedNote = {}) =>
  Object.freeze({ notes: Object.freeze(notes), selectedNote })

const init = () => notesReducer(undefined, { type: '@@INIT' })

describe('notesReducer', () => {
  it('starts with no notes and an empty selected note', () => {
    expect(init()).toEqual({ notes: [], selectedNote: {} })
  })

  it('returns the same state for an unknown action', () => {
    const state = stateWith([older], older)

    expect(notesReducer(state, { type: 'UNKNOWN', payload: {} }))
      .toBe(state)
  })

  describe('CREATE_NOTE_FULFILLED', () => {
    it('appends the note', () => {
      const state = stateWith([older])
      const next = notesReducer(state, {
        type: 'CREATE_NOTE_FULFILLED',
        payload: newer
      })

      expect(next.notes).toEqual([older, newer])
      expect(next.selectedNote).toBe(state.selectedNote)
    })
  })

  describe('UPDATE_NOTE_FULFILLED', () => {
    const action = (payload) =>
      ({ type: 'UPDATE_NOTE_FULFILLED', payload })

    it('replaces the stored note with the payload', () => {
      const updated = { ...older, title: 'Renamed' }
      const next = notesReducer(
        stateWith([older, newer], newer),
        action(updated)
      )

      expect(next.notes).toEqual([newer, updated])
      expect(next.selectedNote).toEqual(newer)
    })

    it('updates the selected note when it is the one updated', () => {
      const updated = { ...older, title: 'Renamed' }
      const next = notesReducer(
        stateWith([older, newer], older),
        action(updated)
      )

      expect(next.selectedNote).toBe(updated)
    })

    it('works from the initial state', () => {
      const next = notesReducer(init(), action(older))

      expect(next).toEqual({ notes: [older], selectedNote: {} })
    })
  })

  describe('DELETE_NOTE_FULFILLED', () => {
    const action = (payload) =>
      ({ type: 'DELETE_NOTE_FULFILLED', payload })

    it('removes the note and keeps another selected note', () => {
      const next = notesReducer(
        stateWith([older, newer], newer),
        action(older)
      )

      expect(next.notes).toEqual([newer])
      expect(next.selectedNote).toEqual(newer)
    })

    it('selects the newest other note of the same notebook', () => {
      const next = notesReducer(
        stateWith([older, newest, newer, elsewhere], newer),
        action(newer)
      )

      expect(next.notes).toEqual([older, newest, elsewhere])
      expect(next.selectedNote).toBe(newest)
    })

    it('selects nothing when the notebook has no notes left', () => {
      const next = notesReducer(
        stateWith([older, elsewhere], older),
        action(older)
      )

      expect(next.notes).toEqual([elsewhere])
      expect(next.selectedNote).toEqual({})
    })

    it('works from the initial state', () => {
      const next = notesReducer(init(), action(older))

      expect(next).toEqual({ notes: [], selectedNote: {} })
    })
  })

  describe('CHANGE_SELECTED_NOTE', () => {
    const action = (payload) =>
      ({ type: 'CHANGE_SELECTED_NOTE', payload })

    it('selects the stored note with the payload id', () => {
      const next = notesReducer(
        stateWith([older, newer], older),
        action({ _id: newer._id })
      )

      expect(next.selectedNote).toBe(newer)
      expect(next.notes).toEqual([older, newer])
    })

    it('selects nothing for an unknown id', () => {
      const next = notesReducer(
        stateWith([older], older),
        action({ _id: 'missing' })
      )

      expect(next.selectedNote).toEqual({})
    })
  })

  describe('CHANGE_ACTIVE_NOTEBOOK', () => {
    const action = (payload) =>
      ({ type: 'CHANGE_ACTIVE_NOTEBOOK', payload })

    it('selects the newest note of the new notebook', () => {
      const next = notesReducer(
        stateWith([older, newest, newer, elsewhere], elsewhere),
        action({ _id: 'nb1' })
      )

      expect(next.selectedNote).toBe(newest)
    })

    it('selects nothing when the notebook has no notes', () => {
      const next = notesReducer(
        stateWith([older], older),
        action({ _id: 'empty' })
      )

      expect(next.selectedNote).toEqual({})
    })
  })
})
