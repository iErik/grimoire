import React from 'react';
import classNames from 'classnames';
import ui from 'redux-ui';

import Input from 'components/Input';

@ui({
  state: {
    hideSearchInput: true
  }
})
export default class SearchBar extends React.Component {
  toggleSearchInput() {
    this.props.updateUI('hideSearchInput', !this.props.ui.hideSearchInput);
  }

  render() {
    let styles = {
      searchBarInput: classNames({
        'searchbar-input': true,
        'is-hidden': this.props.ui.hideSearchInput
      })
    }

    return (
      <div className="floating-searchbar">
        <button className="action-btn" onClick={ this.toggleSearchInput.bind(this) }>
          <span className="action-btn-trigger">
            <i className="icn-search"></i>
          </span>
        </button>
        <div className={ styles.searchBarInput }>
          <Input
            type="text"
            className="input"
            onChange={ this.props.onChange }
            value={ this.props.ui.searchFilter }
          />
        </div>
      </div>
    );
  }
}
