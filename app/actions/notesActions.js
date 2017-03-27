//  Document Creation
//  -----------------

export const createNote = (notebookId, title = 'Untitled', content = '') => ({
  type: 'REQUEST_CREATE_NOTE',
  payload: {
    title,
    contents,
    notebookId
  }
})

export const createNotePending = (note) => ({
  type: 'CREATE_NOTE_PENDING',
  payload: note
})

export const createNoteFulfilled = (note) => ({
  type: 'CREATE_NOTE_FULFILLED',
  payload: note
})

export const createNoteRejected = (error) => ({
  type: 'CREATE_NOTE_REJECTED',
  payload: error
})

//  Document Removal
//  ----------------

export const deleteNote = (note) => ({
  type: 'REQUEST_DELETE_NOTE',
  payload: note
})

export const deleteNotePending = (note) => ({
  type: 'DELETE_NOTE_PENDING',
  payload: note
})

export const deleteNoteFulfilled = (note) => ({
  type: 'DELETE_NOTE_FULFILLED',
  payload: note
})

export const deleteNoteRejected = (error) => ({
  type: 'DELETE_NOTE_REJECTED',
  payload: error
})

//  Document Updates
//  -----------------

export const updateNoteContents = (note, contents) => ({
  type: 'REQUEST_UPDATE_NOTE_CONTENTS',
  payload: {
    note,
    contents
  }
})

export const updateNoteContentsPending = (note, contents) => ({
  type: 'UPDATE_NOTE_CONTENTS_PENDING',
  payload: {
    note,
    contents
  }
})

export const updateNoteContentsRejected = (note, contents) => ({
  type: 'UPDATE_NOTE_CONTENTS_REJECTED',
  payload: {
    note,
    contents
  }
})

export const updateNoteTitle = (note, title) => ({
  type: 'REQUEST_UPDATE_NOTE_TITLE',
  payload: {
    note,
    title
  }
})

export const updateNoteTitlePending = (note, title) => ({
  type: 'UPDATE_NOTE_TITLE_PENDING',
  payload: {
    note,
    title
  }
})

export const updateNoteTitleRejected = (note, title) => ({
  type: 'UPDATE_NOTE_TITLE_REJECTED',
  payload: {
    note,
    title
  }
})

export const updateNoteFulfilled = (note) => ({
  type: 'UPDATE_NOTE_FULFILLED',
  payload: note
})

//  Store Actions
//  -------------

export const changeSelectedNote = (note) => ({
  type: 'CHANGE_SELECTED_NOTE',
  payload: note
})

export const selectNextNote = () => ({
  type: 'SELECT_NEXT_NOTE',
  payload: { }
})

export const editNote = (note) => ({
  type: 'EDIT_NOTE',
  payload: note
})

export const editNoteError = (error) => ({
  type: 'EDIT_NOTE_ERROR',
  payload: error
})
