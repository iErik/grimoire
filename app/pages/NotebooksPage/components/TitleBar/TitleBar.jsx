import React from 'react';

import BurgerButton from 'components/BurgerButton';
import WindowControls from 'components/WindowControls';

export default class Titlebar extends React.Component {
  toggleSidebar() {
    this.props.updateUI('showSidebar', !this.props.ui.showSidebar);
  }

  render() {
    return (
      <div className="notebooks-titlebar">
        <div className="column">
          <div className="control-container">
            <BurgerButton
              isActive={ this.props.ui.showSidebar }
              onClick={ this.toggleSidebar.bind(this) }
            />
          </div>
        </div>
        <div className="column title-container draggable">
          <p className="title">Notebooks</p>
        </div>
        <div className="column">
          <div className="wrapper-window-controls">
            <WindowControls { ...this.props } />
          </div>
        </div>
      </div>
    );
  }
}
