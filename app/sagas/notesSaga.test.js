import { describe, it, expect, vi } from 'vitest'
import {
  takeLatest,
  takeEvery,
  take,
  call,
  put
} from 'redux-saga/effects'
import { BrowserWindow } from 'electron'

import webPreferences from 'config/windowPreferences'
import { notesActions as actions } from 'actions'
import Notes from 'collections/notes'
import notesSaga, {
  createNote,
  deleteNote,
  updateNoteContents,
  updateNoteTitle,
  selectNextNote,
  editNote
} from 'sagas/notesSaga'

// A plain stand-in for the nedb collection, so no datastore file is
// ever opened.
vi.mock('collections/notes', () => ({
  default: {
    insertAsync: vi.fn(),
    removeAsync: vi.fn(),
    updateAsync: vi.fn()
  }
}))

const note = { _id: 'n1', notebookId: 'nb1', title: 'Fireball' }
const error = new Error('boom')

describe('notesSaga', () => {
  describe('createNote', () => {
    const payload = { notebookId: 'nb1', title: 'Fireball' }

    it('inserts the note and fulfills with the new document', () => {
      const gen = createNote({ payload })

      expect(gen.next().value)
        .toEqual(put(actions.createNotePending(payload)))
      expect(gen.next().value)
        .toEqual(call([Notes, Notes.insertAsync], payload))
      expect(gen.next(note).value)
        .toEqual(put(actions.createNoteFulfilled(note)))
      expect(gen.next().done).toBe(true)
    })

    it('rejects with the error when the insert fails', () => {
      const gen = createNote({ payload })

      gen.next()
      gen.next()

      expect(gen.throw(error).value)
        .toEqual(put(actions.createNoteRejected(error)))
      expect(gen.next().done).toBe(true)
    })
  })

  describe('deleteNote', () => {
    it('removes the note by id and fulfills with it', () => {
      const gen = deleteNote({ payload: note })

      expect(gen.next().value)
        .toEqual(put(actions.deleteNotePending(note)))
      expect(gen.next().value)
        .toEqual(call([Notes, Notes.removeAsync], { _id: 'n1' }))
      expect(gen.next().value)
        .toEqual(put(actions.deleteNoteFulfilled(note)))
      expect(gen.next().done).toBe(true)
    })

    it('rejects with the error when the removal fails', () => {
      const gen = deleteNote({ payload: note })

      gen.next()
      gen.next()

      expect(gen.throw(error).value)
        .toEqual(put(actions.deleteNoteRejected(error)))
      expect(gen.next().done).toBe(true)
    })
  })

  // updateNoteContents and updateNoteTitle differ only in the field
  // they set and the actions they dispatch.
  describe.each([
    [
      'updateNoteContents',
      updateNoteContents,
      'contents',
      '# Ice',
      actions.updateNoteContentsPending,
      actions.updateNoteContentsRejected
    ],
    [
      'updateNoteTitle',
      updateNoteTitle,
      'title',
      'Frostbolt',
      actions.updateNoteTitlePending,
      actions.updateNoteTitleRejected
    ]
  ])('%s', (name, worker, field, value, pending, rejected) => {
    const payload = { note, [field]: value }

    it(`sets the ${field} and fulfills with the updated note`, () => {
      const gen = worker({ payload })
      const updated = { ...note, [field]: value }

      expect(gen.next().value).toEqual(put(pending(note, value)))
      expect(gen.next().value).toEqual(call(
        Notes.updateAsync,
        { _id: 'n1' },
        { $set: { [field]: value } },
        { returnUpdatedDocs: true }
      ))
      // nedb's update resolves to [numAffected, updatedDocument].
      expect(gen.next([1, updated]).value)
        .toEqual(put(actions.updateNoteFulfilled(updated)))
      expect(gen.next().done).toBe(true)
    })

    it('rejects with the error when the update fails', () => {
      const gen = worker({ payload })

      gen.next()
      gen.next()

      expect(gen.throw(error).value).toEqual(put(rejected(error)))
      expect(gen.next().done).toBe(true)
    })
  })

  describe('selectNextNote', () => {
    const outcome = take([
      'CREATE_NOTE_FULFILLED',
      'CREATE_NOTE_REJECTED'
    ])

    it('selects the note once its creation is fulfilled', () => {
      const gen = selectNextNote()

      expect(gen.next().value).toEqual(outcome)
      expect(gen.next(actions.createNoteFulfilled(note)).value)
        .toEqual(put(actions.changeSelectedNote(note)))
      expect(gen.next().done).toBe(true)
    })

    it('selects nothing when the creation is rejected', () => {
      const gen = selectNextNote()

      expect(gen.next().value).toEqual(outcome)
      expect(gen.next(actions.createNoteRejected(error)).done)
        .toBe(true)
    })
  })

  describe('editNote', () => {
    it('opens an editor window on the note\'s editor route', () => {
      let editorWindow

      // The shared stub has no webContents; this window needs one.
      BrowserWindow.mockImplementationOnce(function (options) {
        editorWindow = this
        this.options = options
        this.loadURL = vi.fn()
        this.on = vi.fn()
        this.webContents = { once: vi.fn() }
      })

      const gen = editNote({ payload: note })

      expect(gen.next().done).toBe(true)
      expect(editorWindow.options.webPreferences)
        .toEqual(webPreferences)
      expect(editorWindow.loadURL).toHaveBeenCalledTimes(1)
      expect(editorWindow.loadURL.mock.calls[0][0])
        .toMatch(/#\/editor\/nb1\/n1$/)
    })

    it('reports the error when the window can\'t be opened', () => {
      BrowserWindow.mockImplementationOnce(function () {
        throw error
      })

      const gen = editNote({ payload: note })

      expect(gen.next().value)
        .toEqual(put(actions.editNoteError(error)))
      expect(gen.next().done).toBe(true)
    })
  })

  it('wires requests with takeEvery and selection with takeLatest',
    () => {
      expect(notesSaga).toEqual([
        takeEvery('REQUEST_CREATE_NOTE', createNote),
        takeEvery('REQUEST_DELETE_NOTE', deleteNote),
        takeEvery('REQUEST_UPDATE_NOTE_CONTENTS', updateNoteContents),
        takeEvery('REQUEST_UPDATE_NOTE_TITLE', updateNoteTitle),
        takeLatest('SELECT_NEXT_NOTE', selectNextNote),
        takeLatest('EDIT_NOTE', editNote)
      ])
    })
})
