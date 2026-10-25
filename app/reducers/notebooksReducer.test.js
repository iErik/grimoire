import { describe, it, expect } from 'vitest'

import notebooksReducer from 'reducers/notebooksReducer'

const notebook = (id, createdAt) => ({
  _id: id,
  name: `Notebook ${id}`,
  createdAt
})

const older = notebook('nb1', '2018-01-01T00:00:00Z')
const newer = notebook('nb2', '2018-02-01T00:00:00Z')
const newest = notebook('nb3', '2018-03-01T00:00:00Z')

const stateWith = (notebooks, activeNotebook = {}) =>
  Object.freeze({
    notebooks: Object.freeze(notebooks),
    activeNotebook
  })

const init = () => notebooksReducer(undefined, { type: '@@INIT' })

describe('notebooksReducer', () => {
  it('starts with no notebooks and an empty active notebook', () => {
    expect(init()).toEqual({ notebooks: [], activeNotebook: {} })
  })

  it('returns the same state for an unknown action', () => {
    const state = stateWith([older], older)

    expect(notebooksReducer(state, { type: 'UNKNOWN', payload: {} }))
      .toBe(state)
  })

  describe('CREATE_NOTEBOOK_FULFILLED', () => {
    it('appends the notebook', () => {
      const state = stateWith([older], older)
      const next = notebooksReducer(state, {
        type: 'CREATE_NOTEBOOK_FULFILLED',
        payload: newer
      })

      expect(next.notebooks).toEqual([older, newer])
      expect(next.activeNotebook).toBe(older)
    })
  })

  describe('UPDATE_NOTEBOOK_FULFILLED', () => {
    const action = (payload) =>
      ({ type: 'UPDATE_NOTEBOOK_FULFILLED', payload })

    it('replaces the stored notebook with the payload', () => {
      const updated = { ...older, name: 'Renamed' }
      const next = notebooksReducer(
        stateWith([older, newer], newer),
        action(updated)
      )

      expect(next.notebooks).toEqual([newer, updated])
      expect(next.activeNotebook).toEqual(newer)
    })

    it('updates the active notebook when it is updated', () => {
      const updated = { ...older, name: 'Renamed' }
      const next = notebooksReducer(
        stateWith([older, newer], older),
        action(updated)
      )

      expect(next.activeNotebook).toBe(updated)
    })

    it('works from the initial state', () => {
      const next = notebooksReducer(init(), action(older))

      expect(next).toEqual({ notebooks: [older], activeNotebook: {} })
    })
  })

  describe('DELETE_NOTEBOOK_FULFILLED', () => {
    const action = (payload) =>
      ({ type: 'DELETE_NOTEBOOK_FULFILLED', payload })

    it('removes the notebook and keeps another active one', () => {
      const next = notebooksReducer(
        stateWith([older, newer], newer),
        action(older)
      )

      expect(next.notebooks).toEqual([newer])
      expect(next.activeNotebook).toEqual(newer)
    })

    it('activates the newest remaining notebook', () => {
      const next = notebooksReducer(
        stateWith([older, newest, newer], newest),
        action(newest)
      )

      expect(next.notebooks).toEqual([older, newer])
      expect(next.activeNotebook).toBe(newer)
    })

    it('activates nothing when no notebook is left', () => {
      const next = notebooksReducer(
        stateWith([older], older),
        action(older)
      )

      expect(next).toEqual({ notebooks: [], activeNotebook: {} })
    })

    it('works from the initial state', () => {
      const next = notebooksReducer(init(), action(older))

      expect(next).toEqual({ notebooks: [], activeNotebook: {} })
    })
  })

  describe('CHANGE_ACTIVE_NOTEBOOK', () => {
    it('activates the stored notebook with the payload id', () => {
      const next = notebooksReducer(
        stateWith([older, newer], older),
        {
          type: 'CHANGE_ACTIVE_NOTEBOOK',
          payload: { _id: newer._id }
        }
      )

      expect(next.activeNotebook).toBe(newer)
      expect(next.notebooks).toEqual([older, newer])
    })
  })
})
