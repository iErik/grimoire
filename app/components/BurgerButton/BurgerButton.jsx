import React, { PropTypes } from 'react';
import ui from 'redux-ui';
import classNames from 'classnames';

export default class BurgerButton extends React.Component {
  render() {
    let classState = classNames({
      'burger-btn': true,
      'is-active': this.props.isActive
    });

    return (
      <button className={ classState } onClick={ this.props.onClick }>
        <span className="btn-bars"></span>
      </button>
    );
  }
}
