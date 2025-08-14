import { useCallback, useMemo } from 'react'

import { css } from '@css'
import useStore, {
  addNote,
  addFolder,
  setActiveNote
} from '@state'

import type { Note, NoteFolder } from '@state'

import Sidebar, {
  type SidebarActionType,
  type SidebarItem,
  SidebarItemType,
} from '@components/Sidebar'

import NoteEditor from '@components/NoteEditor'
import EmptyState from '@components/EmptyState'


export default function JournalView() {
  const activeNoteId = useStore(state => state.activeNoteId)
  const notes = useStore(state => state.notes)
  const folders = useStore(state => state.folders)


  const activeNote = activeNoteId && notes[activeNoteId]

  const sidebarActions: SidebarActionType[] = [
    {
      icon: 'NoteAdd',
      label: 'New note',
      handler: () => {
        const newNoteId = addNote()
        setActiveNote(newNoteId)
      }
    },
    {
      icon: 'FolderAdd',
      label: 'New folder',
      handler: () => {
        addFolder()
      }
    },
    {
      icon: 'Search',
      label: 'Search notes',
      handler: () => {}
    },
    {
      icon: 'Settings',
      label: 'Tweak application settings',
      handler: () => {}
    },
  ]

  const sidebarItems = useMemo(
    () => useSidebarItems(notes, folders),
    [ notes, folders ]
  )


  const onEditorChange = useCallback((contents: string) => {
    console.log('onEditorChange: ', { contents })
  }, [])


  return(
    <div className={styles.root}>
      <div className={styles.sidebar}>
        <Sidebar
          actions={sidebarActions}
          items={sidebarItems}
          activeItemId={activeNoteId}
        />
      </div>

      <div className={styles.editor}>
      { activeNote
        ? <NoteEditor
          content={activeNote.content}
          onChange={onEditorChange}
        />
        : <EmptyState
          title="Whoa! Such empty..."
          description="Create a new file"
          vFill
        />
      }
      </div>
    </div>
  )
}

/*--------------------------------------------------------/
/ -> Styling                                              /
/--------------------------------------------------------*/

const styles = {
  root: css({
    display: 'grid',
    gridTemplateColumns: 'minmax(250px, 280px) 1fr',

    width: '100%',
    height: '100%'
  }),

  sidebar: css({ }),

  // TODO: Border here is causing weird and annoying
  // artifacts on the right side of the window.
  editor: css({
    border: '2px solid',
    blRadius: 'base'
  })
}

/*--------------------------------------------------------/
/ -> Hooks                                                /
/--------------------------------------------------------*/

const useSidebarItems = (
  notes: Record<string, Note>,
  folders: Record<string, NoteFolder>
): SidebarItem[] => {
  let orphanNotes = Object.keys(notes)
    .reduce<Record<string, null>>((acc, key) => ({
      ...acc,
      [key]: null
    }), {})

  const mapNote = (note: Note) => ({
    type: SidebarItemType.Note,
    id: note.id,
    name: note.title
  })

  const items = Object.values(folders).map(folder => ({
    type: SidebarItemType.Folder,
    id: folder.id,
    name: folder.name,
    items: folder.notes.map(noteId => {
      const { [noteId]: _, ...rest } = orphanNotes
      orphanNotes = rest
      const note = notes[noteId]

      return note ? mapNote(note) : null
    })
    .filter(n => !!n)
  }))

  return [
    ...items,
    ...Object.keys(orphanNotes)
      .map(noteId => {
        const note = notes[noteId]
        return note ? mapNote(note) : null
      })
      .filter(n => !!n)
  ]
}

