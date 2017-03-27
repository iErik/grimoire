import React from 'react';
import ui from 'redux-ui';
import AceEditor from 'react-ace';

import 'brace/mode/markdown';
import 'brace/theme/kuroir';
import 'brace/theme/tomorrow_night_eighties';

import MarkdownIt from 'markdown-it';
import toMarkdown from 'to-markdown';

import { without } from 'underscore';

import TitleBar from './components/TitleBar';
import Sidebar from 'layouts/EditorLayout/components/Sidebar';
import Editor from './components/Editor';

export default ui({
  key: 'editorPage',
  state: {
    mdContents: ({ selectedNote }) => toMarkdown(selectedNote.contents) || '',
    editorOptions: ({ selectedNote }) => ({
      name: selectedNote._id || 'brace-editor',
      theme: 'kuroir',
      mode: 'markdown',
      width: '100%',
      height: '100%',
      showGutter: false,
      wrapEnabled: true
    })
  }
})(({ selectedNote, updateNoteContents, ...props }) => {
  let editor;

  const getSelection = () => {
    return editor.session.getTextRange(editor.getSelectionRange());
  }

  const toHtml = (md) => {
    return MarkdownIt({ linkify: true }).render(md);
  }

  const updateValue = (newValue) => {
    props.updateUI({ mdContents: newValue });
  }

  const docActions = {
    saveDocument: () => {
      updateNoteContents(selectedNote, toHtml(props.ui.mdContents))
    }
  };

  const editorActions = {
    insertBold: () => {
      let selection = without(getSelection().split(''), '*');

      selection.unshift('**');
      selection.push('**');

      editor.insert(selection.join(''));
      editor.focus();
    },

    insertItalic: () => {
      let selection = without(getSelection().split(''), '*');

      selection.unshift('*');
      selection.push('*')

      editor.insert(selection.join(''));
      editor.focus();
    },

    insertEmpashis: () => {
      let selection = without(getSelection().split(''), '*');

      selection.unshift('***');
      selection.push('***')

      editor.insert(selection.join(''));
      editor.focus();
    },

    insertStrikethrough: () => {
      let selection = without(getSelection().split(''), '*');

      selection.unshift('~~');
      selection.push('~~')

      editor.insert(selection.join(''));
      editor.focus();
    },

    insertUnorderedList: () => {
      editor.navigateTo(editor.getCursorPosition().row, 0);
      editor.insert('* ');
      editor.focus();
    },

    insertOrderedList: () => {
      var previousLineRow = editor.getCursorPosition().row - 1;
      var previousLineContent = '';
      var listItemNumber = 1;

      while ((previousLineRow > -1) && (previousLineContent === '')) {
        previousLineContent = editor.session.getLine(previousLineRow);
        --previousLineRow;
      }

      if (/^(\d+)\./.test(previousLineContent))
        listItemNumber = parseInt(previousLineContent.match(/^(\d+)\./)[1]) + 1;

      editor.navigateTo(editor.getCursorPosition().row, 0);
      editor.insert(`${listItemNumber}. `);
      editor.focus();
    },

    insertLink: () => {
      let selection = getSelection();
      var newCursorPosition = selection === '' ? 10 : 1;

      editor.insert(`[${selection}](http://)`);
      editor.navigateLeft(newCursorPosition);
      editor.focus();
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
        <Sidebar { ...props } docActions={ docActions } />

        <Editor>
          <AceEditor ref={ c => editor = c ? c.editor : undefined }
            { ...props.ui.editorOptions }

            value={ props.ui.mdContents }
            onChange={ updateValue }
          />
        </Editor>
      </section>
    </div>
  );
})
