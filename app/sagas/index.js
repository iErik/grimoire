import notebooksSaga from './notebooksSaga';
import notesSaga from './notesSaga';

export default function *rootSaga() {
  yield [
    ...notebooksSaga,
    ...notesSaga
  ]
}
