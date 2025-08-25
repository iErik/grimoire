import path from 'path';
import Datastore from 'nedb';
import electron from 'electron';
//import { promisify, promisifyAll } from 'bluebird';

import Bluebird from 'bluebird';

const app = electron.remote ? electron.remote.app : electron.app;
const dbPath = path.join(app.getPath('userData'), 'storage/notes.db');

const Notes = new Datastore({
  filename: dbPath,
  timestampData: true,
  autoload: true,
});

Notes.updateAsync = Bluebird.promisify(Notes.update, {
  multiArgs: true,
  context: Notes
});

export default Bluebird.promisifyAll(Notes, { filter: name => name !== 'update' });
