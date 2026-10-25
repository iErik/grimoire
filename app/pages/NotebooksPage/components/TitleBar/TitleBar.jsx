import React from 'react'

import BurgerButton from 'components/BurgerButton'
import WindowControls from 'components/WindowControls'

export default class Titlebar extends React.Component {
  toggleSidebar() {
    this.props.updateUI('showSidebar', !this.props.ui.showSidebar)
  }

  render() {
    return (
      <div className="notebooks-titlebar">
        <div className="column title-container draggable">
          <p className="title">Notebooks</p>
        </div>
        {/* Electron applies drag regions in document order, so
            this no-drag section must come after the full-width
            draggable title, which it overlaps, or the title's drag
            region swallows its clicks. */}
        <div className="section section-left column">
          <div className="control-container">
            <BurgerButton
              isActive={ this.props.ui.showSidebar }
              onClick={ this.toggleSidebar.bind(this) }
            />
          </div>
        </div>
        <div className="section section-right column">
          <div className="wrapper-window-controls">
            <WindowControls { ...this.props } />
          </div>
        </div>
      </div>
    )
  }
}
