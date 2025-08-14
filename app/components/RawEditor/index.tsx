import { useRef } from 'react'

import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'

type RawEditorProps = {

}

const RawEditor = (props: RawEditorProps) => {
  const viewEl = useRef<HTMLDivElement | null>(null)

  const setViewRef = (el: HTMLDivElement) => {
    viewEl.current = el
  }

  return (
    <div ref={setViewRef} />
  )
}

/*--------------------------------------------------------/
/ -> Hook                                                 /
/--------------------------------------------------------*/

const useCodeMirror = () => {
  const state = EditorState.create({ })

  const view = new EditorView({ })
}

/*--------------------------------------------------------/
/ -> Theming                                              /
/--------------------------------------------------------*/

const editorTheme = EditorView.theme({

})

export default RawEditor
