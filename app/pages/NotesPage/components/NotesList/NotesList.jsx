import React from 'react';
import classNames from 'classnames'
import moment from 'moment';

import { truncateChars } from 'utils/stringTools';

export default class NotesList extends React.Component {
  creationDate(note) {
    return moment(note.createdAt).calendar(null, {
      sameDay: 'HH:mm',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'DD/MM/YY'
    });
  }

  renderNoteExcerpt(note) {
    let sanitizer = document.createElement('div');
    let extractedText;

    sanitizer.innerHTML = note.contents;
    extractedText = sanitizer.textContent || sanitizer.innerText || '';

    return truncateChars(extractedText, 215);
  }

  renderNotes() {
    return this.props.notes.map((note) => {
      if (note.notebookId !== this.props.activeNotebook._id)
        return;

      let style = classNames({
        'note-list-entry': true,
        'is-selected': this.props.selectedNote._id === note._id
      });

      return (
        <li className={ style } key={ note._id }
          onClick={ this.props.changeSelectedNote.bind(this, note) }>

          <div className="entry-title">
            <p className="title">{ note.title }</p>
            <p className="meta-date">{ this.creationDate(note) }</p>
          </div>
          <div className="entry-contents">
            { note.contents
            ? <p className="contents">{ this.renderNoteExcerpt(note) }</p>
            : <p className="meta-empty">Empty Note&hellip;</p>
            }
          </div>
        </li>
      )
    });
  }

  render() {
    return (
      <section className="notes-list">
        <ul className="notes-list-entries">
          { this.props.isStoreLoading
          ? ''
          : this.renderNotes()
          }
        </ul>
      </section>
    );
  }
}
