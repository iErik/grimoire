import { find, sortBy, reject } from 'underscore';

const initialState = {
  notes: [],
  selectedNote: undefined
};

export default function notesReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'CREATE_NOTE_FULFILLED':
      return {
        ...state,
        notes: [...state.notes, payload]
      }

    case 'UPDATE_NOTE_FULFILLED':
      return {
        ...state,
        notes: [
          ...reject(state.notes, note => note._id === payload._id),
          payload,
        ],

        selectedNote: payload._id === state.selectedNote._id
          ? payload
          : { ...state.selectedNote }
      }

    case 'DELETE_NOTE_FULFILLED':
      return {
        ...state,
        notes: reject(state.notes, note => note._id === payload._id),

        selectedNote: payload._id === state.selectedNote._id
          ? find(sortBy(state.notes,
              note => -(new Date(note.createdAt).getTime())),
              note => (
                note.notebookId === payload.notebookId &&
                note._id !== payload._id
            )) || { }
          : { ...state.selectedNote }
      }

    case 'CHANGE_SELECTED_NOTE':
      return {
        ...state,
        selectedNote: find(state.notes, note => note._id === payload._id) || {},
      }

    case 'CHANGE_ACTIVE_NOTEBOOK':
      return {
        ...state,
        selectedNote: find(sortBy(state.notes,
          note => -(new Date(note.createdAt).getTime())),
          note => note.notebookId === payload._id) || { }
      }

    default:
      return state;
  }
}
