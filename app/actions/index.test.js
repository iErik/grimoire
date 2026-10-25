import { describe, it, expect } from 'vitest'

import actions, {
  notebooksActions,
  settingsActions,
  notesActions
} from 'actions'
import * as notebooks from 'actions/notebooksActions'
import * as settings from 'actions/settingsActions'
import * as notes from 'actions/notesActions'

describe('actions index', () => {
  it('re-exports each action module', () => {
    expect(notebooksActions.createNotebook)
      .toBe(notebooks.createNotebook)
    expect(settingsActions.changeApplicationTheme)
      .toBe(settings.changeApplicationTheme)
    expect(notesActions.createNote).toBe(notes.createNote)
  })

  // The default export is built by copying the settings and notes
  // creators into the notebooks module's namespace object, so that
  // object's own keys can't serve as the list of notebook creators.
  const notebookCreators = [
    'createNotebook',
    'createNotebookPending',
    'createNotebookFulfilled',
    'createNotebookRejected',
    'deleteNotebook',
    'deleteNotebookPending',
    'deleteNotebookFulfilled',
    'deleteNotebookRejected',
    'updateNotebookName',
    'updateNotebookNamePending',
    'updateNotebookNameRejected',
    'updateNotebookFulfilled',
    'changeActiveNotebook'
  ]

  it('default export holds every creator of all three', () => {
    const names = [
      ...notebookCreators,
      ...Object.keys(settings),
      ...Object.keys(notes)
    ]

    expect(Object.keys(actions).sort()).toEqual(names.sort())

    for (const name of notebookCreators)
      expect(actions[name]).toBe(notebooks[name])

    for (const module of [settings, notes]) {
      for (const [name, fn] of Object.entries(module))
        expect(actions[name]).toBe(fn)
    }
  })
})
