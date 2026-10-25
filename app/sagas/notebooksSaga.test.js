import { describe, it, expect, vi } from 'vitest'
import { takeEvery, call, put } from 'redux-saga/effects'

import { notebooksActions as actions } from 'actions'
import Notebooks from 'collections/notebooks'
import notebooksSaga, {
  createNotebook,
  deleteNotebook,
  updateNotebookName
} from 'sagas/notebooksSaga'

// A plain stand-in for the nedb collection, so no datastore file is
// ever opened.
vi.mock('collections/notebooks', () => ({
  default: {
    insertAsync: vi.fn(),
    removeAsync: vi.fn(),
    updateAsync: vi.fn()
  }
}))

const notebook = { _id: 'nb1', name: 'Spells' }
const error = new Error('boom')

describe('notebooksSaga', () => {
  describe('createNotebook', () => {
    const payload = { name: 'Spells' }

    it('inserts the notebook and fulfills with the new one', () => {
      const gen = createNotebook({ payload })

      expect(gen.next().value)
        .toEqual(put(actions.createNotebookPending(payload)))
      expect(gen.next().value)
        .toEqual(call([Notebooks, Notebooks.insertAsync], payload))
      expect(gen.next(notebook).value)
        .toEqual(put(actions.createNotebookFulfilled(notebook)))
      expect(gen.next().done).toBe(true)
    })

    it('rejects with the error when the insert fails', () => {
      const gen = createNotebook({ payload })

      gen.next()
      gen.next()

      expect(gen.throw(error).value)
        .toEqual(put(actions.createNotebookRejected(error)))
      expect(gen.next().done).toBe(true)
    })
  })

  describe('deleteNotebook', () => {
    it('removes the notebook by id and fulfills with it', () => {
      const gen = deleteNotebook({ payload: notebook })

      expect(gen.next().value)
        .toEqual(put(actions.deleteNotebookPending(notebook)))
      expect(gen.next().value).toEqual(call(
        [Notebooks, Notebooks.removeAsync],
        { _id: 'nb1' }
      ))
      expect(gen.next().value)
        .toEqual(put(actions.deleteNotebookFulfilled(notebook)))
      expect(gen.next().done).toBe(true)
    })

    it('rejects with the error when the removal fails', () => {
      const gen = deleteNotebook({ payload: notebook })

      gen.next()
      gen.next()

      expect(gen.throw(error).value)
        .toEqual(put(actions.deleteNotebookRejected(error)))
      expect(gen.next().done).toBe(true)
    })
  })

  describe('updateNotebookName', () => {
    const payload = { notebook, name: 'Cantrips' }

    it('sets the name and fulfills with the updated document', () => {
      const gen = updateNotebookName({ payload })
      const updated = { ...notebook, name: 'Cantrips' }

      expect(gen.next().value).toEqual(
        put(actions.updateNotebookNamePending(notebook, 'Cantrips'))
      )
      expect(gen.next().value).toEqual(call(
        Notebooks.updateAsync,
        { _id: 'nb1' },
        { $set: { name: 'Cantrips' } },
        { returnUpdatedDocs: true }
      ))
      // nedb's update resolves to [numAffected, updatedDocument].
      expect(gen.next([1, updated]).value)
        .toEqual(put(actions.updateNotebookFulfilled(updated)))
      expect(gen.next().done).toBe(true)
    })

    it('rejects with the error when the update fails', () => {
      const gen = updateNotebookName({ payload })

      gen.next()
      gen.next()

      expect(gen.throw(error).value)
        .toEqual(put(actions.updateNotebookNameRejected(error)))
      expect(gen.next().done).toBe(true)
    })
  })

  it('wires each request action to its worker with takeEvery', () => {
    expect(notebooksSaga).toEqual([
      takeEvery('REQUEST_CREATE_NOTEBOOK', createNotebook),
      takeEvery('REQUEST_DELETE_NOTEBOOK', deleteNotebook),
      takeEvery('REQUEST_UPDATE_NOTEBOOK_NAME', updateNotebookName)
    ])
  })
})
