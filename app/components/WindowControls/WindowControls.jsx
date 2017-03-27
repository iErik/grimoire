import React from 'react';
import ui from 'redux-ui';

export default class WindowControls extends React.Component {
  closeWindow() {
    console.log("WindowControls.ui: ", this.props.ui);
    this.props.ui.currentWindow.close();
  }

  minimizeWindow() {
    this.props.ui.currentWindow.minimize();
  }

  maximizeWindow() {
    this.props.ui.currentWindow.maximize();
  }

  render() {
    return (
      <div className="window-controls">
        <button className="btn btn-maximize"
          onClick={ this.maximizeWindow.bind(this) }>
        </button>
        <button className="btn btn-minimize"
          onClick={ this.minimizeWindow.bind(this) }>
        </button>
        <button className="btn btn-close"
          onClick={ this.closeWindow.bind(this) }>
        </button>
      </div>
    );
  }
}
