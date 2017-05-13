import { find, sortBy, reject } from 'underscore';

const initialState = {
  notebooks: [],
  activeNotebook: { },
};

export default function notebooksReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'CREATE_NOTEBOOK_FULFILLED':
      return {
        ...state,
        notebooks: [...state.notebooks, payload]
      }

    case 'UPDATE_NOTEBOOK_FULFILLED':
      return {
        ...state,
        notebooks: [
          ...reject(state.notebooks, notebook => notebook._id === payload._id),
          payload,
        ],

        activeNotebook: payload._id === state.activeNotebook._id
          ? payload
          : { ...state.activeNotebook }
      }

    case 'DELETE_NOTEBOOK_FULFILLED':
      return {
        ...state,
        notebooks: reject(state.notebooks, ({ _id }) => _id === payload._id),
        activeNotebook: payload._id === state.activeNotebook._id
          ? find(sortBy(state.notebooks,
              notebook => -(new Date(notebook.createdAt).getTime())),
              notebook => notebook._id !== payload._id
            ) || { }
          : { ...state.activeNotebook }
      }

    case 'CHANGE_ACTIVE_NOTEBOOK':
      return {
        ...state,
        activeNotebook: find(state.notebooks, ({ _id }) => _id === payload._id)
      }

    default:
      return state;
  }
}
