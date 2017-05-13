import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

export default class Sidebar extends React.Component {
  createNote() {
    this.props.createNote(this.props.params.notebookId);
  }

  renderDocuments() {
    return this.props.notes.map((note) => (
      <li className='document-list-entry' key={ note._id }>

        <Link className="title" activeClassName="is-active"
          to={{ pathname: `/editor/${this.props.params.notebookId}/${note._id}` }}>
          { note.title }.md
        </Link>

        <button
          className="btn btn-delete"
          onClick={ this.props.deleteNote.bind(null, note) }>
          <i className="icn-trashbin"></i>
        </button>

      </li>
    ));
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
            <button className="btn" onClick={ this.props.docActions.saveDocument }>
              <i className="icn-floppy"></i>
            </button>
          </div>
          <div className="document-action">
            <button className="btn">
              <i className="icn-single-a-plus"></i>
            </button>
          </div>
          <div className="document-action">
            <button className="btn">
              <i className="icn-single-a-minus"></i>
            </button>
          </div>
          <div className="document-action">
            <button className="btn">
              <i className="icn-moon"></i>
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
