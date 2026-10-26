import { connect } from 'react-redux'
import { sortBy, filter, find } from 'underscore'

import EditorLayout from 'layouts/EditorLayout'
import storeActions from 'actions'
import nextNote from 'utils/nextNote'

const mapStateToProps = (state, { match }) => {
  const { notebookId, noteId } = match.params
  const editedNote = find(state.notes.notes,
    note => note._id === noteId)

  return {
    notes: sortBy(filter(state.notes.notes,
      note => note.notebookId === notebookId),
    note => -(new Date(note.createdAt).getTime())),

    editedNote,
    // The note to switch to while the edited note is missing.
    nextNote: editedNote
      ? undefined
      : nextNote(state.notes.notes, notebookId),

    editorTheme: state.settings.editorTheme,
    editorFontSize: state.settings.editorFontSize,
    editorFontFamily: state.settings.editorFontFamily,

    isStoreLoading: state.initialState.loading
  }
}

export default connect(mapStateToProps, storeActions)(EditorLayout)
