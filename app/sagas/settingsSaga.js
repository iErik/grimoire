import { takeEvery, put, call } from 'redux-saga/effects';

import { settingsActions as actions } from '../actions';
import settings from 'electron-settings';

function *updateSettingKeypath({ payload }) {
  try {

    yield put(actions.updateSettingsKeypathPending(payload));

    yield call([settings, settings.set], payload.keyPath, payload.value);
    const nextSettings = yield call([settings, settings.get]);

    yield put(actions.updateSettingsKeypathFulfilled(nextSettings));
  } catch (error) {
    yield put(actions.updateSettingsKeypathRejected(error));
  }
}

export default [
 takeEvery('REQUEST_UPDATE_SETTINGS_KEYPATH', updateSettingKeypath)
]
