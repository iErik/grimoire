import { find } from 'underscore';

const initialState = {
  notebooks: [],
  activeNotebook: { },
};

export default function notebooksReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_ACTIVE_NOTEBOOK':
      return {
        ...state,
        activeNotebook: find(state.notebooks, (notebook) => {
          return notebook._id === action.payload.id;
        })
      }

    case 'DELETE_NOTEBOOK_FULFILLED':
      return { ...state };

    default:
      return state;
  }
}
