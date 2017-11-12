import {
  takeLatest,
  takeEvery,
  select,
  apply,
  take,
  call,
  put
} from 'redux-saga/effects';

import { BrowserWindow } from 'electron';

import { notesActions as actions } from '../actions';
import Notes from '../database/collections/notes';

export function *createNote({ payload }) {
  try {
    yield put(actions.createNotePending(payload));

    const newNote = yield call([Notes, Notes.insertAsync], payload);

    yield put(actions.createNoteFulfilled(newNote));
  } catch (error) {
    yield put(actions.createNoteRejected(error));
  }
}

export function *deleteNote({ payload }) {
  try {
    yield put(actions.deleteNotePending(payload));

    yield call([Notes, Notes.removeAsync], { _id: payload._id });

    yield put(actions.deleteNoteFulfilled(payload));
  } catch (error) {
    yield put(actions.deleteNoteRejected(error));
  }
}

export function *updateNoteContents({ payload }) {
  try {
    const { note, contents } = payload;

    yield put(actions.updateNoteContentsPending(note, contents));

    const updatePayload = yield call(
      Notes.updateAsync,
      { _id: note._id },
      { $set: { contents } },
      { returnUpdatedDocs: true }
    );

    yield put(actions.updateNoteFulfilled(updatePayload[1]));
  } catch (error) {
    yield put(actions.updateNoteContentsRejected(error));
  }
}

export function *updateNoteTitle({ payload }) {
  try {
    const { note, title } = payload;

    yield put(actions.updateNoteTitlePending(note, title));

    const updatePayload = yield call(
      Notes.updateAsync,
      { _id: note._id },
      { $set: { title } },
      { returnUpdatedDocs: true }
    );

    yield put(actions.updateNoteFulfilled(updatePayload[1]));
  } catch (error) {
    yield put(actions.updateNoteTitleRejected(error));
  }
}

export function *selectNextNote() {
  const { type, payload } = yield take([
    'CREATE_NOTE_FULFILLED',
    'CREATE_NOTE_REJECTED'
  ]);

  if (type !== 'CREATE_NOTE_REJECTED')
    yield put(actions.changeSelectedNote(payload));
}

export function *editNote({ payload }) {
  try {
    var editorWindow = new BrowserWindow({
      width: 600,
      height: 610,
      frame: false,
      show: false,
      transparent: true,
    });

    editorWindow.loadURL(
      `file://${__dirname}/../app.html#/editor/${payload.notebookId}/${payload._id}`
    );

    editorWindow.webContents.once('did-finish-load', () => {
      editorWindow.show();
      editorWindow.focus();
    });

    editorWindow.on('closed', () => editorWindow = null);
  } catch (error) {
    yield put(actions.editNoteError(error));
  }
}

export default [
  takeEvery('REQUEST_CREATE_NOTE', createNote),
  takeEvery('REQUEST_DELETE_NOTE', deleteNote),

  takeEvery('REQUEST_UPDATE_NOTE_CONTENTS', updateNoteContents),
  takeEvery('REQUEST_UPDATE_NOTE_TITLE', updateNoteTitle),

  takeLatest('SELECT_NEXT_NOTE', selectNextNote),
  takeLatest('EDIT_NOTE', editNote),
]
