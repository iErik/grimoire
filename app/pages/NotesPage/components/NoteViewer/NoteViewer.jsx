import React from 'react';
import moment from 'moment';

export default class NoteViewer extends React.Component {
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
            <p className="title">
              { this.props.isStoreLoading
              ? ''
              : this.props.selectedNote.title
              }
            </p>
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
