import Datastore from 'nedb';
import { promisifyAll } from 'bluebird';

const Notebooks = new Datastore({
  filename: './app/storage/notebooks.db',
  timestampData: true,
  autoload: true,
});

export default promisifyAll(Notebooks);
