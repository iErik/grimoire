import { connect } from 'react-redux';
import { sortBy, filter } from 'underscore';
import DashboardLayout from 'layouts/DashboardLayout';

import storeActions from 'actions';

const mapStateToProps = (state) => ({
  notebooks: sortBy(state.notebooks.notebooks,
    notebook => -(new Date(notebook.createdAt).getTime())),

  notes: sortBy(filter(state.notes.notes,
    note => note.notebookId === state.notebooks.activeNotebook._id),
    note => -(new Date(note.createdAt).getTime())),

  activeNotebook: state.notebooks.activeNotebook,
  selectedNote: state.notes.selectedNote,

  settings: state.settings,
  isStoreLoading: state.initialState.loading
});

export default connect(mapStateToProps, storeActions)(DashboardLayout);
