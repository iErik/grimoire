import { takeEvery, call, put } from 'redux-saga/effects';

import { notebooksActions as actions } from '../actions';
import Notebooks from '../database/collections/notebooks';

export function *createNotebook({ payload }) {
  try {
    yield put(actions.createNotebookPending(payload));

    const newNotebook = yield call([Notebooks, Notebooks.insertAsync], payload);

    yield put(actions.createNotebookFulfilled(newNotebook));
  } catch (error) {
    yield put(actions.createNotebookRejected(error));
  }
}

export function *deleteNotebook({ payload }) {
  try {
    yield put(actions.deleteNotebookPending(payload));

    yield call([Notebooks, Notebooks.removeAsync], { _id: payload._id });

    yield put(actions.deleteNotebookFulfilled(payload));
  } catch (error) {
    yield put(actions.deleteNotebookRejected(error));
  }
}

export function *updateNotebookName({ payload }) {
  try {
    const { notebook, name } = payload;

    yield put(actions.updateNotebookNamePending(notebook, name));

    const updatePayload = yield call(
      Notebooks.updateAsync,
      { _id: notebook._id },
      { $set: { name } },
      { returnUpdatedDocs: true }
    );

    yield put(actions.updateNotebookFulfilled(updatePayload[1]));
  } catch (error) {
    yield put(actions.updateNotebookNameRejected(error));
  }
}


export default [
  takeEvery('REQUEST_CREATE_NOTEBOOK', createNotebook),
  takeEvery('REQUEST_DELETE_NOTEBOOK', deleteNotebook),
  takeEvery('REQUEST_UPDATE_NOTEBOOK_NAME', updateNotebookName),
]
