export function createNotebook(name = 'New Notebook') {
  return {
    type: 'CREATE_NOTEBOOK',
    payload: {
      name
    }
  }
}

export function deleteNotebook(notebook) {
  return {
    type: 'DELETE_NOTEBOOK',
    payload: notebook
  }
}

export function updateNotebook(notebook, updates) {
  return {
    type: 'UPDATE_NOTEBOOK',
    payload: {
      notebook,
      updates
    }
  }
}


export function changeActiveNotebook(id) {
  return {
    type: 'CHANGE_ACTIVE_NOTEBOOK',
    payload: {
      id
    }
  }
}
