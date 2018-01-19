import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ui from 'redux-ui';

import Input from 'components/Input';

@ui({
  state: {
    hideOptions: true
  }
})
export default class NotebookCard extends React.Component {
  static contextTypes = { router: PropTypes.object.isRequired }

  updateNotebookName(ev) {
    this.props.updateNotebookName(this.props.notebook, ev.target.value);
  }

  openNotebook() {
    this.props.changeActiveNotebook(this.props.notebook);
    this.context.router.push('/dashboard/');
  }

  openNote(note, ev) {
    ev.stopPropagation();
    this.props.editNote(note)
  }

  deleteNote(note, ev) {
    ev.stopPropagation();
    this.props.deleteNote(note);
  }

  renderNotes() {
    if (this.props.notes.length > 0) {
      return this.props.notes.map((note) => (
        <li className="card-notes-list-entry" key={ note._id }>
          <p className="title" onClick={ this.openNote.bind(this, note) }>
            { note.title }
          </p>

          <button
            className="btn btn-delete"
            onClick={ this.deleteNote.bind(this, note) }>
            <i className="icn-trashbin"></i>
          </button>
        </li>
      ));
    } else {
      return (
        <li className="card-notes-list-empty">
          <p className="title">Empty Notebook&hellip;</p>
        </li>
      )
    }
  }

  render() {
    let styles = {
      cardOptions: classNames({
        'card-options': true,
        'is-hidden': this.props.ui.hideOptions
      })
    }

    return (
      <div className="notebook-card">
        <div className="card-control">
          <div className="title-container">
            <Input
              type="text"
              value={ this.props.notebook.name }
              className="title-control"
              onChange={ this.updateNotebookName.bind(this) }
            />
          </div>
          <div className="control-container">
            <button className="btn" onClick={ this.props.deleteNotebook.bind(null, this.props.notebook) }>
              <i className="icn-close"></i>
            </button>
          </div>
        </div>
        <div className="card-contents" onClick={ this.openNotebook.bind(this) }>
          <ul className="card-notes-list-entries">
            { this.renderNotes() }
          </ul>

          <div className={ styles.cardOptions }></div>
        </div>
      </div>
    );
  }
}
