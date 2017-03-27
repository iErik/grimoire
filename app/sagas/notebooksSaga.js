import { takeEvery } from 'redux-saga/effects';
import Notebooks from '../database/collections/notebooks';

export function *createNotebook(action) {

}

export function *updateNotebook(action) {

}

export function *deleteNotebook(action) {

}

export default [
  takeEvery('CREATE_NOTEBOOK', createNotebook),
  takeEvery('UPDATE_NOTEBOOK', updateNotebook),
  takeEvery('DELETE_NOTEBOOK', deleteNotebook),
]
