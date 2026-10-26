import { filter, sortBy } from 'underscore'

// The note an editor window switches to when its edited note is
// gone: the newest note of the notebook, by `createdAt`, the same
// order the main window uses when a notebook is activated.
// Undefined when the notebook has no notes left, which means the
// editor window closes.
export default function nextNote(notes, notebookId) {
  const notebookNotes = filter(notes,
    note => note.notebookId === notebookId)

  return sortBy(notebookNotes,
    note => -(new Date(note.createdAt).getTime()))[0]
}
