import path from 'path';
import Datastore from 'nedb';
import electron from 'electron';
//import { promisify, promisifyAll } from 'bluebird';
import Bluebird from 'bluebird';

const app = electron.remote ? electron.remote.app : electron.app;
const dbPath = path.join(app.getPath('userData'), 'storage/notebooks.db');

const Notebooks = new Datastore({
  filename: dbPath,
  timestampData: true,
  autoload: true,
});

Notebooks.updateAsync = Bluebird.promisify(Notebooks.update, {
  multiArgs: true,
  context: Notebooks
});

export default Bluebird.promisifyAll(Notebooks, { filter: name => name !== 'update' });
