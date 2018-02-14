import { remote } from 'electron';
import React from 'react';
import ui from 'redux-ui';
import os from 'os';

@ui({
  state: {
    currentWindow: () => { return remote.getCurrentWindow(); }
  }
})
export default class RootLayout extends React.Component {
  render() {
    let platform = os.platform();

    return (
      <div className={`root-container ${ platform } theme-${this.props.appTheme}`}>
        { this.props.children }
      </div>
    );
  }
}
