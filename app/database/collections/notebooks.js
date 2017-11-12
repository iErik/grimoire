import path from 'path';
import Datastore from 'nedb';
import electron from 'electron';
import { promisify, promisifyAll } from 'bluebird';

const app = electron.remote ? electron.remote.app : electron.app;
const dbPath = path.join(app.getPath('userData'), 'storage/notebooks.db');

const Notebooks = new Datastore({
  filename: dbPath,
  timestampData: true,
  autoload: true,
});

Notebooks.updateAsync = promisify(Notebooks.update, {
  multiArgs: true,
  context: Notebooks
});

export default promisifyAll(Notebooks, { filter: name => name !== 'update' });
