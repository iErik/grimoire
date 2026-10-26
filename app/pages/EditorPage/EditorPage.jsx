import React from 'react'
import PropTypes from 'prop-types'
import ui from 'redux-ui'
import AceEditor from 'react-ace'

import 'brace/mode/markdown'

import MarkdownIt from 'markdown-it'

import TitleBar from './components/TitleBar'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'

import { without, union, map } from 'underscore'
import { editorThemes } from 'config/themes'
import {
  noteShape,
  editorThemesShape,
  uiPropTypes
} from 'utils/propShapes'

const EditorPage = ({ updateNoteContents, ...props }) => {
  var editor

  const loadThemes = async () => {
    if (props.ui.areThemesLoaded) return

    let { light, dark } = editorThemes

    await Promise.all(map(union(light, dark), (theme) => {
      return import(`brace/theme/${theme.name}`)
    }))

    props.updateUI({ areThemesLoaded: true })
  }

  const getTheme = () => {
    if (!props.ui.areThemesLoaded) return ''

    return props.ui.isDark
      ? props.editorTheme.dark.name
      : props.editorTheme.light.name
  }

  const getSelection = () => {
    return editor.session.getTextRange(editor.getSelectionRange())
  }

  const toHtml = (md) => {
    return MarkdownIt({ linkify: true }).render(md)
  }

  const updateValue = (newValue) => {
    props.updateUI({ mdContents: newValue })
  }

  const docActions = {
    saveDocument: () => {
      // Nothing to save to while the edited note is missing.
      if (!props.editedNote) return

      updateNoteContents(
        props.editedNote,
        toHtml(props.ui.mdContents)
      )
    },
    switchMode: () => {
      props.updateUI({ isDark: !props.ui.isDark })
    },
    increaseFontSize: () => {
      if (props.editorFontSize >= 90) return

      props.changeEditorFontSize(props.editorFontSize + 1)
    },
    decreaseFontSize: () => {
      if (props.editorFontSize <= 1) return

      props.changeEditorFontSize(props.editorFontSize - 1)
    }
  }

  const editorActions = {
    insertBold: () => {
      let selection = without(getSelection().split(''), '*')

      selection.unshift('**')
      selection.push('**')

      editor.insert(selection.join(''))
      editor.focus()
    },

    insertItalic: () => {
      let selection = without(getSelection().split(''), '*')

      selection.unshift('*')
      selection.push('*')

      editor.insert(selection.join(''))
      editor.focus()
    },

    insertEmpashis: () => {
      let selection = without(getSelection().split(''), '*')

      selection.unshift('***')
      selection.push('***')

      editor.insert(selection.join(''))
      editor.focus()
    },

    insertStrikethrough: () => {
      let selection = without(getSelection().split(''), '*')

      selection.unshift('~~')
      selection.push('~~')

      editor.insert(selection.join(''))
      editor.focus()
    },

    insertUnorderedList: () => {
      editor.navigateTo(editor.getCursorPosition().row, 0)
      editor.insert('* ')
      editor.focus()
    },

    insertOrderedList: () => {
      var previousLineRow = editor.getCursorPosition().row - 1
      var previousLineContent = ''
      var listItemNumber = 1

      while ((previousLineRow > -1) && (previousLineContent === '')) {
        previousLineContent = editor.session.getLine(previousLineRow)
        --previousLineRow
      }

      if (/^(\d+)\./.test(previousLineContent))
        listItemNumber =
          parseInt(previousLineContent.match(/^(\d+)\./)[1]) + 1

      editor.navigateTo(editor.getCursorPosition().row, 0)
      editor.insert(`${listItemNumber}. `)
      editor.focus()
    },

    insertLink: () => {
      let selection = getSelection()
      var newCursorPosition = selection === '' ? 10 : 1

      editor.insert(`[${selection}](http://)`)
      editor.navigateLeft(newCursorPosition)
      editor.focus()
    },

    insertQuote: () => {

    },

    insertImage: () => {

    },

    insertCode: () => {

    },
  }

  return (
    <div className="collapse inner stack container">
      <section className="title-bar-container">
        <TitleBar { ...props } editorActions={ editorActions } />
      </section>
      <section className="full-height editor-container">
        <Sidebar {  ...props  } docActions={ docActions } />

        <Editor>
          <AceEditor ref={ c => editor = c ? c.editor : undefined }

            { ...props.ui.editorOptions }

            fontSize={ props.editorFontSize }
            theme={ getTheme() }
            value={ props.ui.mdContents }
            onChange={ updateValue }
            onLoad={ loadThemes }
          />
        </Editor>
      </section>
    </div>
  )
}

EditorPage.propTypes = {
  ui: uiPropTypes.ui,
  updateUI: uiPropTypes.updateUI,
  // The edited note: undefined when it no longer exists.
  editedNote: noteShape,
  // Undefined until the settings have loaded.
  editorFontSize: PropTypes.number,
  editorTheme: editorThemesShape,
  updateNoteContents: PropTypes.func.isRequired,
  changeEditorFontSize: PropTypes.func.isRequired
}

export default ui({
  key: 'editorPage',
  state: {
    editorOptions: (props) => ({
      name: (props.editedNote && props.editedNote._id) ||
        'brace-editor',
      fontSize: props.editorFontSize,
      mode: 'markdown',
      width: '100%',
      height: '100%',
      showGutter: false,
      wrapEnabled: true,
      showPrintMargin: false,
      focus: true
    })
  }
})(EditorPage)
