import React from 'react'
import PropTypes from 'prop-types'
import { noteShape } from 'utils/propShapes'
import moment from 'moment'

import Input from 'components/Input'
import { orEmpty } from 'utils/stringTools'

export default class NoteViewer extends React.Component {
  static propTypes = {
    selectedNote: noteShape.isRequired,
    isStoreLoading: PropTypes.bool.isRequired,
    updateNoteTitle: PropTypes.func.isRequired
  }

  renameNote(ev) {
    this.props.updateNoteTitle(
      this.props.selectedNote,
      ev.target.value
    )
  }

  renderCreationDate() {
    if (this.props.selectedNote.createdAt) {
      const createdAt = moment(this.props.selectedNote.createdAt)

      return createdAt.calendar(null, {
        sameDay: 'HH:mm',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'DD/MM/YY'
      })
    }
  }

  renderContent() {
    if (this.props.isStoreLoading)
      return { __html: '' }
    else
      return { __html: this.props.selectedNote.contents }
  }

  renderEmptyState() {
    return (
      <div className="note-viewer">
        <div className="note-empty">
          <p className="empty-message">
            This notebook has no notes
          </p>
        </div>
      </div>
    )
  }

  render() {
    const { isStoreLoading, selectedNote } = this.props

    if (!isStoreLoading && !selectedNote._id)
      return this.renderEmptyState()

    return (
      <div className="note-viewer">
        <div className="note-header">
          <div className="note-title">
            <Input
              type="text"
              className="input-title"
              value={ isStoreLoading
                ? ''
                : orEmpty(selectedNote.title) }
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
    )
  }
}
