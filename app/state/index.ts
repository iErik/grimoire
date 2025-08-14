import { create, type StateCreator } from 'zustand'
import { produce } from 'immer'


type ActionFn = (state: AppState) => AppState | void

export type UUID = string

export type Note = {
  id: UUID
  tags: string[]
  title: string
  content: string
  folderId: string | null
  createdAt: number
  updatedAt: number
}

export type NoteFolder = {
  id: UUID
  name: string
  notes: UUID[]
  createdAt: number
  updatedAt: number
}

export type AppState = {
  activeNoteId: UUID | null
  notes: Record<UUID, Note>
  folders: Record<UUID, NoteFolder>
}


const createState: StateCreator<AppState> = () => ({
  activeNoteId: null,
  notes: {},
  folders: {},
})

const useStore = create<AppState>()(createState)


const setState = (handler: ActionFn) =>
  useStore.setState(produce(handler))
const getState = useStore.getState


/*--------------------------------------------------------/
/ -> Actions                                              /
/--------------------------------------------------------*/

export const mkUuid = (length: number) => {
  let str = ''

  while (str.length < length)
    str += Math.random().toString(36).substring(2)

  return str
    .replace('.', '')
    .substring(0, length)
}


export const addNote = (folderId?: string | null): UUID => {
  const id = mkUuid(70)

  setState(state => {
    state.notes[id] = {
      id,
      tags: [],
      title: 'Untitled',
      content: '',
      folderId: folderId ?? null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  })

  return id
}

export const deleteNote = (
  noteId: UUID
) => setState((state) => {
  const { [noteId]: note, ...notes } = state.notes

  if (!note) return

  state.notes = notes

  const folder = note.folderId
    ? state.folders[note.folderId]
    : null

  if (folder) {
    folder.notes = folder.notes.filter(id => id !== note.id)
  }
})

export const setActiveNote = (noteId: string | null) => {
  setState(state => { state.activeNoteId = noteId })
}

// Removes a note's parent if parentId is 'null'
export const setNoteParent = (
  noteId: UUID,
  folderId: UUID | null
) => setState(state => {
  const note = state.notes[noteId]

  if (!note) return

  note.folderId = folderId
  const parent = folderId
    ? state.folders[folderId]
    : note.folderId
      ? state.folders[note.folderId]
      : null

  if (!parent) return

  parent.notes = folderId
    ? [ ...(parent.notes || []), note.id ]
    : parent.notes.filter(id => id !== note.id)
})



export const addFolder = (): UUID => {
  const id = mkUuid(70)

  setState(state => {
    state.folders[id] = {
      id,
      name: 'Untitled Folder',
      notes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  })

  return id
}

export const deleteFolder = (
  folderId: UUID,
  includeNotes: boolean = false
) => setState(state => {
  const { [folderId]: folder, ...folders } = state.folders

  if (!folder) return

  if (includeNotes) {
    folder.notes.forEach(noteId => {
      const { [noteId]: note, ...notes } = state.notes
      state.notes = notes
    })
  }

  state.folders = folders
})


export default useStore
