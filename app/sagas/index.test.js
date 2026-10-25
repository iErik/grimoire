import { describe, it, expect, vi } from 'vitest'

import rootSaga from 'sagas'
import notebooksSaga from 'sagas/notebooksSaga'
import settingsSaga from 'sagas/settingsSaga'
import notesSaga from 'sagas/notesSaga'

vi.mock('collections/notebooks', () => ({ default: {} }))
vi.mock('collections/notes', () => ({ default: {} }))
vi.mock('electron-settings', () => ({ default: {} }))

describe('rootSaga', () => {
  it('starts every saga module\'s watchers at once', () => {
    const gen = rootSaga()

    expect(gen.next().value).toEqual([
      ...notebooksSaga,
      ...settingsSaga,
      ...notesSaga
    ])
    expect(gen.next().done).toBe(true)
  })
})
