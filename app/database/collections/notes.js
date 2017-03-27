import Datastore from 'nedb';
import { promisify, promisifyAll } from 'bluebird';

const Notes = new Datastore({
  filename: './app/storage/notes.db',
  timestampData: true,
  autoload: true,
});

Notes.updateAsync = promisify(Notes.update, {
  multiArgs: true,
  context: Notes
});

export default promisifyAll(Notes, { filter: name => name !== 'update' });
