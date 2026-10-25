import { describe, it, expect, vi } from 'vitest'
import { takeEvery, call, put } from 'redux-saga/effects'

import { settingsActions as actions } from 'actions'
import settings from 'electron-settings'
import settingsSaga from 'sagas/settingsSaga'

// A plain stand-in for electron-settings, so no settings file is
// ever read or written.
vi.mock('electron-settings', () => ({
  default: { get: vi.fn(), set: vi.fn() }
}))

const error = new Error('boom')
const payload = { keyPath: 'theme', value: 'dark' }

// The worker isn't exported. In redux-saga 0.16, takeEvery returns
// a fork effect whose args are [pattern, worker].
const worker = settingsSaga[0].FORK.args[1]

describe('settingsSaga', () => {
  describe('updateSettingKeypath', () => {
    it('sets the key path and fulfills with all settings', () => {
      const gen = worker({ payload })
      const nextSettings = { theme: 'dark' }

      expect(gen.next().value)
        .toEqual(put(actions.updateSettingsKeypathPending(payload)))
      expect(gen.next().value).toEqual(
        call([settings, settings.set], 'theme', 'dark')
      )
      expect(gen.next().value)
        .toEqual(call([settings, settings.get]))
      expect(gen.next(nextSettings).value).toEqual(
        put(actions.updateSettingsKeypathFulfilled(nextSettings))
      )
      expect(gen.next().done).toBe(true)
    })

    it('rejects with the error when saving fails', () => {
      const gen = worker({ payload })

      gen.next()
      gen.next()

      expect(gen.throw(error).value)
        .toEqual(put(actions.updateSettingsKeypathRejected(error)))
      expect(gen.next().done).toBe(true)
    })
  })

  it('wires the key path request to its worker', () => {
    expect(settingsSaga).toEqual([
      takeEvery('REQUEST_UPDATE_SETTINGS_KEYPATH', worker)
    ])
  })
})
