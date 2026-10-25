import { describe, it, expect } from 'vitest'

import * as actions from 'actions/notesActions'

const note = { _id: 'n1', notebookId: 'nb1', title: 'Fireball' }
const error = new Error('boom')

describe('notesActions', () => {
  it('createNote requests a note with a title and contents', () => {
    expect(actions.createNote('nb1', 'Fireball', '# Fire'))
      .toEqual({
        type: 'REQUEST_CREATE_NOTE',
        payload: {
          title: 'Fireball',
          contents: '# Fire',
          notebookId: 'nb1'
        }
      })
  })

  it('createNote defaults to an empty "Untitled" note', () => {
    expect(actions.createNote('nb1')).toEqual({
      type: 'REQUEST_CREATE_NOTE',
      payload: { title: 'Untitled', contents: '', notebookId: 'nb1' }
    })
  })

  it.each([
    ['updateNoteContents', 'REQUEST_UPDATE_NOTE_CONTENTS'],
    ['updateNoteContentsPending', 'UPDATE_NOTE_CONTENTS_PENDING'],
    ['updateNoteContentsRejected', 'UPDATE_NOTE_CONTENTS_REJECTED']
  ])('%s carries the note and contents as %s', (name, type) => {
    expect(actions[name](note, '# Ice')).toEqual({
      type,
      payload: { note, contents: '# Ice' }
    })
  })

  it.each([
    ['updateNoteTitle', 'REQUEST_UPDATE_NOTE_TITLE'],
    ['updateNoteTitlePending', 'UPDATE_NOTE_TITLE_PENDING'],
    ['updateNoteTitleRejected', 'UPDATE_NOTE_TITLE_REJECTED']
  ])('%s carries the note and title as %s', (name, type) => {
    expect(actions[name](note, 'Frostbolt')).toEqual({
      type,
      payload: { note, title: 'Frostbolt' }
    })
  })

  it('selectNextNote has an empty payload', () => {
    expect(actions.selectNextNote()).toEqual({
      type: 'SELECT_NEXT_NOTE',
      payload: {}
    })
  })

  it.each([
    ['createNotePending', 'CREATE_NOTE_PENDING', note],
    ['createNoteFulfilled', 'CREATE_NOTE_FULFILLED', note],
    ['createNoteRejected', 'CREATE_NOTE_REJECTED', error],
    ['deleteNote', 'REQUEST_DELETE_NOTE', note],
    ['deleteNotePending', 'DELETE_NOTE_PENDING', note],
    ['deleteNoteFulfilled', 'DELETE_NOTE_FULFILLED', note],
    ['deleteNoteRejected', 'DELETE_NOTE_REJECTED', error],
    ['updateNoteFulfilled', 'UPDATE_NOTE_FULFILLED', note],
    ['changeSelectedNote', 'CHANGE_SELECTED_NOTE', note],
    ['editNote', 'EDIT_NOTE', note],
    ['editNoteError', 'EDIT_NOTE_ERROR', error]
  ])('%s creates a %s action', (name, type, arg) => {
    expect(actions[name](arg)).toEqual({ type, payload: arg })
  })
})
