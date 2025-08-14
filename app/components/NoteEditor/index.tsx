import { useRef, useCallback } from 'react'

import {
  useCodeMirror,
} from '@uiw/react-codemirror'

import type { ViewUpdate } from '@codemirror/view'

import {
  markdown,
  markdownLanguage
} from '@codemirror/lang-markdown'

import { languages } from '@codemirror/language-data'

import markdownCanvas from '@vendor/markdown-canvas'

import { css } from '@css'

import EditorTheme from './theme'


type EditorProps = {
  content: string,
  onChange: (text: string, vu: ViewUpdate) => any
}

export default function NoteEditor(props: EditorProps) {
  const {
    state,
    view,
    container,
    setContainer
  } = useCodeMirror({
    basicSetup: { lineNumbers: false },
    value: props.content,
    onChange: props.onChange,
    theme: EditorTheme,
    height: '100%',
    extensions: [
      markdown({
        base: markdownLanguage,
        codeLanguages: languages
      }),

      markdownCanvas({ markdoc: {} }),

      EditorTheme
    ]
  })

  const viewRef = useRef<HTMLDivElement | null>(null)

  const setViewRef = useCallback((el: HTMLDivElement) => {
    viewRef.current = el
    setContainer(el)
  }, [ setContainer ])

  return (
    <div className={styles.editorView} ref={setViewRef} />
  )
}

/*--------------------------------------------------------/
/ -> Styling                                              /
/--------------------------------------------------------*/

const styles = {
  editorView: css({
    height: '100%',

    //'& > .cm-editor': { height: '100%' }
  })
}

/*--------------------------------------------------------/
/ -> Re-exports                                           /
/--------------------------------------------------------*/

export type { ViewUpdate }
