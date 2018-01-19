import React from 'react';
import PropTypes from 'prop-types';

export default class ActionButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool
  }

  render() {
    return (
      <button className="action-btn">
        <span className="action-btn-trigger" onClick={ this.props.onClick }>
          <p className="action-btn-trigger-label">+</p>
        </span>
      </button>
    );
  }
}
