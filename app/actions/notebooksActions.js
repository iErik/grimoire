//  Document Creation
//  ------------------

export const createNotebook = (name = 'New Notebook') => ({
  type: 'REQUEST_CREATE_NOTEBOOK',
  payload: {
    name
  }
})

export const createNotebookPending = (notebook) => ({
  type: 'CREATE_NOTEBOOK_PENDING',
  payload: notebook,
})

export const createNotebookFulfilled = (notebook) => ({
  type: 'CREATE_NOTEBOOK_FULFILLED',
  payload: notebook
})

export const createNotebookRejected = (error) => ({
  type: 'CREATE_NOTEBOOK_REJECTED',
  payload: error
})

//  Document Removal
//  ----------------

export const deleteNotebook = (notebook) => ({
  type: 'REQUEST_DELETE_NOTEBOOK',
  payload: notebook
})

export const deleteNotebookPending = (notebook) => ({
  type: 'DELETE_NOTEBOOK_PENDING',
  payload: notebook
})

export const deleteNotebookFulfilled = (notebook) => ({
  type: 'DELETE_NOTEBOOK_FULFILLED',
  payload: notebook
})

export const deleteNotebookRejected = (error) => ({
  type: 'DELETE_NOTEBOOK_REJECTED',
  payload: error
})

//  Document Updates
//  ----------------

export const updateNotebookName = (notebook, name) => ({
  type: 'REQUEST_UPDATE_NOTEBOOK_NAME',
  payload: {
    notebook,
    name
  }
})

export const updateNotebookNamePending = (notebook, name) => ({
  type: 'UPDATE_NOTEBOOK_NAME_PENDING',
  payload: {
    notebook,
    name
  }
})

export const updateNotebookNameRejected = (error) => ({
  type: 'UPDATE_NOTEBOOK_NAME_REJECTED',
  payload: error
})

export const updateNotebookFulfilled = (notebook) => ({
  type: 'UPDATE_NOTEBOOK_FULFILLED',
  payload: notebook
})

//  Store Actions
//  -------------

export const changeActiveNotebook = (notebook) => ({
  type: 'CHANGE_ACTIVE_NOTEBOOK',
  payload: notebook
})
