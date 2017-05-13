import { connect } from 'react-redux';
import { sortBy, filter, find } from 'underscore';

import EditorLayout from 'layouts/EditorLayout';
import storeActions from 'actions';

const mapStateToProps = (state, { routeParams }) => ({
  notes: sortBy(filter(state.notes.notes,
    note => note.notebookId === routeParams.notebookId),
    note => -(new Date(note.createdAt).getTime())),

  activeNotebook: find(state.notebooks.notebooks,
    notebook => notebook._id === routeParams.notebookId),
  selectedNote: find(state.notes.notes,
    note => note._id == routeParams.noteId),

  editorTheme: state.settings.editorTheme,
  editorFontSize: state.settings.editorFontSize,
  editorFontFamily: state.settings.editorFontFamily,

  isStoreLoading: state.initialState.loading
})

export default connect(mapStateToProps, storeActions)(EditorLayout);
