import { EditorView } from '@codemirror/view'

const EditorTheme = EditorView.theme({
  '.cm-scroller': {
    maxWidth: 'var(--sizes-max-doc-width)',
    width: '100%',
    margin: '0 auto'
  },

  '.cm-gutters, .cm-activeLineGutter': {
    border: '0',
    background: 'transparent'
  },

  '.cm-gutterElement': {
    display: 'flex',
    alignItems: 'center'
  }
})


export default EditorTheme
