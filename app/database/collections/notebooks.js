import Datastore from 'nedb';
import { promisify, promisifyAll } from 'bluebird';

const Notebooks = new Datastore({
  filename: './app/storage/notebooks.db',
  timestampData: true,
  autoload: true,
});

Notebooks.updateAsync = promisify(Notebooks.update, {
  multiArgs: true,
  context: Notebooks
});

export default promisifyAll(Notebooks, { filter: name => name !== 'update' });
