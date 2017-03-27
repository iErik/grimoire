import { omit, pick, map, each } from 'underscore';

import Notebooks from '../collections/notebooks';
import Notes from '../collections/notes';

import notebooksSeeds from './notebooks';
import notesSeeds from './notes';

export default async function runSeeders() {
  await notebooksSeeder(notebooksSeeds);
  await notesSeeder(notesSeeds);
}

async function notebooksSeeder(notebooks) {
  await Notebooks.removeAsync.call(Notebooks, {});
  await Notebooks.insertAsync.call(Notebooks, notebooks);
}

async function notesSeeder(notes) {
  await Notes.removeAsync.call(Notes, {});
  await Notes.insertAsync.call(Notes, notes);
}
