import notebooksSaga from './notebooksSaga';
import settingsSaga from './settingsSaga';
import notesSaga from './notesSaga';

export default function *rootSaga() {
  yield [
    ...notebooksSaga,
    ...settingsSaga,
    ...notesSaga
  ]
}
