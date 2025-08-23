import { memo } from 'react'

import { css, sva } from '@css'
import Icon, { type IconName } from '@icons'

import {
  useDraggable,
  useDragArea
} from '@components/Draggable'


export default function Sidebar(props: SidebarProps) {
  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        { (props.actions || []).map(action => (
          <div
            className={styles.toolbarAction}
            key={action.label}
            onClick={action.handler}
          >
            <Icon icon={action.icon} size={28} />
          </div>
        )) }
      </div>

      <div className={styles.items}>
      { (props.items || []).map(item =>
        item.type === SidebarItemType.Note
          ? <NoteItem
            key={item.id}
            note={item}
            active={props.activeItemId === item.id}
          />
          : <FolderItem
            key={item.id}
            folder={item}
            open={false}
          />
       ) }
      </div>
    </div>
  )
}


const NoteItem = memo((props: {
  note: NoteItem,
  active: boolean,
  nested?: boolean
}) => {
  const classes = styles.item({
    type: 'note',
    active: props.active,
    nested: props.nested
  })

  const dragEl = () => <p>{ props.note.name }</p>
  const onDrag = () => {
    console.log('Note being dragged: ', props.note.id)
  }

  const dragRef = useDraggable({
    renderEl: ({ activeArea }) => (
      <>
        <p>{props.note.name}</p>
        <p>{ activeArea }</p>
      </>
    ),
    payload: {
      type: 'NoteItem',
      data: props.note
    }
  })

  return (
    <div ref={dragRef} className={classes.item}>
      <p className={classes.label}>
        { props.note.name }
      </p>
    </div>
  )
})

const FolderItem = (props: {
  folder: FolderItem,
  open: boolean
}) => {
  const classes = styles.item({ type: 'folder' })

  const dragAreaRef = useDragArea({
    accept: (payload: any) => {
      if (payload.type === 'FolderItem')
        return payload.data.id !== props.folder.id

      if (payload.type === 'NoteItem')
        return true

      return false
    },
    onDrop: (payload: any) => {
      if (payload.type === 'FolderItem') {}

      if (payload.type === 'NoteItem') {}
    },
    areaName: 'Folder'
  })

  return (
    <div ref={dragAreaRef} className={classes.container}>
      <div className={classes.item}>
        <Icon
          icon="ArrowLeftThick"
          className={classes.icon}
          size={15}
        />

        <p className={classes.label}>
          { props.folder.name }
        </p>
      </div>

      <div className={classes.children}>
      { (props.folder.items || []).map(note =>
          <NoteItem
            key={note.id}
            note={note}
            active={false}
            nested
          />
      ) }
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
    gridTemplateRows: 'auto 1fr'
  }),

  toolbar: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(30px, 1fr))',
    justifyItems: 'center',
    padding: '13px 0px',

    margin: '0 11px',
    borderBottom: '1px solid grey'
  }),

  toolbarAction: css({
    cursor: 'pointer'
  }),

  items: css({
    display: 'flex',
    flexDirection: 'column',
    padding: '15px 15px'
  }),

  item: sva({
    slots: [
      'container',
      'item',
      'label',
      'icon',
      'children'
    ],
    base: {
      container: {

      },
      children: {

      },

      item: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 4,

        transition: 'background 200ms',
        cursor: 'pointer',

        _hover: {
          background: 'rgba({colors.fg.rgb}, 0.2)'
        }
      },
      label: {
        fontFamily: 'sans',
        fontSize: 'base',
        fontWeight: 'medium',
        color: 'fg',
        marginLeft: '18px',
        userSelect: 'none'
      },
      icon:{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-55%)',
        '& svg': { fill: 'fg' }
      }
    },
    variants: {
      type: {
        note: { },
        folder: { }
      },
      nested: {
        true: {
          label: { marginLeft: '36px' }
        }
      },
      active: {
        true: {
          item: { background: 'rgba({colors.fg.rgb}, 0.2)' }
        }
      }
    }
  })
}

/*--------------------------------------------------------/
/ -> Types                                                /
/--------------------------------------------------------*/

export type SidebarActionType = {
  icon: IconName,
  label: string,
  handler: () => any
}

export const SidebarItemType = {
  Folder: 'Folder',
  Note: 'Note'
} as const

export type NoteItem = {
  type: typeof SidebarItemType.Note
  id: string
  name: string
}

export type FolderItem = {
  type: typeof SidebarItemType.Folder
  id: string
  name: string
  items: NoteItem[]
}

export type SidebarItem = FolderItem | NoteItem

export type SidebarProps = {
  actions: SidebarActionType[]
  items: SidebarItem[]
  activeItemId: string | null
}

