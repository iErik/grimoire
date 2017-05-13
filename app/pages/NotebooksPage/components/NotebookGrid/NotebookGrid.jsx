import React from 'react';
import ui from 'redux-ui';
import { filter } from 'underscore';

import NotebookCard from './components/NotebookCard';
import SearchBar from './components/SearchBar';
import ActionButton from 'components/ActionButton';

@ui({
  state: {
    searchFilter: ''
  }
})
export default class NotebookGrid extends React.Component {
  updateSearchFilter(ev) {
    this.props.updateUI('searchFilter', ev.target.value);
  }

  createNotebook() {
    this.props.createNotebook();
  }

  renderNotebookCards() {
    return this.props.notebooks.map((notebook) => {
      if (notebook.name.indexOf(this.props.ui.searchFilter) < 0) {
        return;
      } else {
        return (
          <li
            key={ notebook._id }
            className="notebook-card-entry small-6 medium-3 xlarge-2 column">

            <NotebookCard
              { ...this.props }

              notebook={ notebook }
              notes={ filter(this.props.notes, note => note.notebookId === notebook._id) }
            />
          </li>
        )
      }
    })
  }

  render() {
    return (
      <div className="notebook-grid">
        <ul className="notebook-cards-entries row">
          { this.renderNotebookCards() }
        </ul>
        <div className="searchbar-container">
          <SearchBar
            { ...this.props }
            onChange={ this.updateSearchFilter.bind(this) }
          />
        </div>
        <div className="action-btn-container">
          <ActionButton
            onClick={ this.props.createNotebook.bind(null, undefined) }
          />
        </div>
      </div>
    );
  }
}
