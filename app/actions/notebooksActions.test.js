import { describe, it, expect } from 'vitest'

import * as actions from 'actions/notebooksActions'

const notebook = { _id: 'nb1', name: 'Spells' }
const error = new Error('boom')

describe('notebooksActions', () => {
  it('createNotebook requests a notebook with the given name', () => {
    expect(actions.createNotebook('Spells')).toEqual({
      type: 'REQUEST_CREATE_NOTEBOOK',
      payload: { name: 'Spells' }
    })
  })

  it('createNotebook defaults the name to "New Notebook"', () => {
    expect(actions.createNotebook()).toEqual({
      type: 'REQUEST_CREATE_NOTEBOOK',
      payload: { name: 'New Notebook' }
    })
  })

  it('updateNotebookName carries the notebook and new name', () => {
    expect(actions.updateNotebookName(notebook, 'Hexes')).toEqual({
      type: 'REQUEST_UPDATE_NOTEBOOK_NAME',
      payload: { notebook, name: 'Hexes' }
    })
  })

  it('updateNotebookNamePending carries notebook and name', () => {
    expect(actions.updateNotebookNamePending(notebook, 'Hexes'))
      .toEqual({
        type: 'UPDATE_NOTEBOOK_NAME_PENDING',
        payload: { notebook, name: 'Hexes' }
      })
  })

  it.each([
    ['createNotebookPending', 'CREATE_NOTEBOOK_PENDING', notebook],
    [
      'createNotebookFulfilled',
      'CREATE_NOTEBOOK_FULFILLED',
      notebook
    ],
    ['createNotebookRejected', 'CREATE_NOTEBOOK_REJECTED', error],
    ['deleteNotebook', 'REQUEST_DELETE_NOTEBOOK', notebook],
    ['deleteNotebookPending', 'DELETE_NOTEBOOK_PENDING', notebook],
    [
      'deleteNotebookFulfilled',
      'DELETE_NOTEBOOK_FULFILLED',
      notebook
    ],
    ['deleteNotebookRejected', 'DELETE_NOTEBOOK_REJECTED', error],
    [
      'updateNotebookNameRejected',
      'UPDATE_NOTEBOOK_NAME_REJECTED',
      error
    ],
    [
      'updateNotebookFulfilled',
      'UPDATE_NOTEBOOK_FULFILLED',
      notebook
    ],
    ['changeActiveNotebook', 'CHANGE_ACTIVE_NOTEBOOK', notebook]
  ])('%s creates a %s action', (name, type, arg) => {
    expect(actions[name](arg)).toEqual({ type, payload: arg })
  })
})
