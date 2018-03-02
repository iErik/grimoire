import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import ui from 'redux-ui';

import Input from 'components/Input';

@ui({
  state: {
    hightlightSelectedNote: false
  }
})
export default class Sidebar extends React.Component {
  createNote() {
    this.props.createNote(this.props.params.notebookId);
  }

  renameNote(note, ev) {
    if (note._id === this.props.selectedNote._id) ev.preventDefault();

    const handler = (ev) => {
      this.props.updateUI('hightlightSelectedNote', false);
      document.removeEventListener('click', handler);
    }

    if (!this.props.ui.renameSelectedNote)
      this.props.updateUI('hightlightSelectedNote', true);

    document.addEventListener('click', handler);
  }

  updateNoteTitle(note, ev) {
    this.props.updateNoteTitle(note, ev.target.value);
  }

  renderDocuments() {
    return this.props.notes.map((note) => {
      let style = classNames({
        'document-list-entry': true,
        'is-editing': note._id === this.props.selectedNote._id &&
                      this.props.ui.hightlightSelectedNote
      })

      return (
        <li className={ style } key={ note._id }>

          <Input
            type="text"
            className="title-input"
            onChange={ this.updateNoteTitle.bind(this, note) }
            value={ note.title }

            onClick={ (ev) => {
              ev.stopPropagation();
              ev.nativeEvent.stopImmediatePropagation();
            }}
          />

          <NavLink className="title" activeClassName="is-active"
            to={ `/editor/${this.props.params.notebookId}/${note._id}` }
            onClick={ this.renameNote.bind(this, note) } >

            { note.title }.md
          </NavLink>

          <button
            className="btn btn-delete"
            onClick={ this.props.deleteNote.bind(null, note) }>
            <i className="icn-trashbin"></i>
          </button>

          </li>
      );
    });
  }

  render() {
    let style = classNames({
      'editor-sidebar': true,
      'is-active': this.props.ui.showSidebar,
    })

    return (
      <nav className={ style }>
        <div className="document-actions">
          <div className="document-action">
            <button className="btn"
              onClick={ this.props.docActions.saveDocument }>
              <i className="icn-floppy"></i>
            </button>
          </div>
          <div className="document-action">
            <button className="btn"
              onClick={ this.props.docActions.increaseFontSize }>
              <i className="icn-single-a-plus"></i>
            </button>
          </div>
          <div className="document-action">
            <button className="btn"
              onClick={ this.props.docActions.decreaseFontSize }>
              <i className="icn-single-a-minus"></i>
            </button>
          </div>
          <div className="document-action">
            <button className="btn"
              onClick={ this.props.docActions.switchMode }>
              <i className={ this.props.ui.isDark ? 'icn-moon-dark' : 'icn-moon' }></i>
            </button>
          </div>
        </div>

        <ul className="document-list-entries">
          { this.renderDocuments() }
        </ul>

        <div className="document-action" onClick={ this.createNote.bind(this) }>
          <button className="btn" >
            <i className="icn-plus"></i>
          </button>
          <span className="label">New Document</span>
        </div>
      </nav>
    );
  }
}
