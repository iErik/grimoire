import React from 'react';

import BurgerButton from 'components/BurgerButton';
import WindowControls from 'components/WindowControls';

export default class TitleBar extends React.Component {
  toggleSidebar() {
    this.props.updateUI('showSidebar', !this.props.ui.showSidebar);
  }

  render() {
    return (
      <div className="settings-titlebar">
        <div className="section section-left column">
          <div className="control-container">
            <BurgerButton
              isActive={ this.props.ui.showSidebar }
              onClick={ this.toggleSidebar.bind(this) }
            />
          </div>
        </div>
        <div className="draggable title-container column">
          <p className="title">Settings</p>
        </div>
        <div className="section section-right wrapper-window-controls">
          <WindowControls { ...this.props } />
        </div>
      </div>
    );
  }
}
