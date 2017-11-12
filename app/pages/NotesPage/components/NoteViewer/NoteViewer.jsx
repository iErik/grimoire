import React from 'react';
import moment from 'moment';

import Input from 'components/Input';

export default class NoteViewer extends React.Component {
  renameNote(ev) {
    this.props.updateNoteTitle(this.props.selectedNote, ev.target.value);
  }

  renderCreationDate() {
    if (this.props.selectedNote.createdAt) {
      return moment(this.props.selectedNote.createdAt).calendar(null, {
        sameDay: 'HH:mm',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'DD/MM/YY'
      });
    }
  }

  renderContent() {
    if (this.props.isStoreLoading)
      return { __html: '' }
    else
      return { __html: this.props.selectedNote.contents }
  }

  render() {
    return (
      <div className="note-viewer">
        <div className="note-header">
          <div className="note-title">
            <Input
              type="text"
              className="input-title"
              value={ this.props.isStoreLoading ? '' : this.props.selectedNote.title }
              onChange={ this.renameNote.bind(this) }
            />
          </div>
          <div className="note-meta">
            <p className="meta-date">
              { this.props.isStoreLoading
              ? ''
              : this.renderCreationDate()
              }
            </p>
          </div>
        </div>
        <div className="note-contents typography"
          dangerouslySetInnerHTML={ this.renderContent() }>
        </div>
      </div>
    );
  }
}
