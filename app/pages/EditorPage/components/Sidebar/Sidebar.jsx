import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

export default class Sidebar extends React.Component {
  componentDidMount() {
    console.log("Sidebar.props: ", this.props);
  }

  goToDocument(doc) {
    return;
  }

  renderDocuments() {
    return this.props.notes.map((note) => (
      <li
        key={ note._id }
        className='document-list-entry'
        onClick={ this.goToDocument.bind(this, note) }>

        <Link className="title" activeClassName="is-active"
          to={{ pathname: `/editor/${this.props.params.notebookId}/${note._id}` }}>
          { note.title }.md
        </Link>

        <button className="btn">
          <i className="fa"></i>
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
              <i className="fa fa-save"></i>
            </button>
          </div>
          <div className="document-action">
            <button className="btn">
              <i className="fa fa-plus"></i>
            </button>
          </div>
          <div className="document-action">
            <button className="btn">
              <i className="fa fa-minus"></i>
            </button>
          </div>
          <div className="document-action">
            <button className="btn">
              <i className="fa fa-moon-o"></i>
            </button>
          </div>
        </div>

        <ul className="document-list-entries">
          { this.renderDocuments() }
        </ul>
      </nav>
    );
  }
}
