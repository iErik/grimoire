import { remote } from 'electron';
import React from 'react';
import ui from 'redux-ui';

@ui({
  state: {
    currentWindow: () => { return remote.getCurrentWindow(); }
  }
})
export default class RootLayout extends React.Component {
  render() {
    return (
      <div className={ `root-container theme-${this.props.appTheme}` }>
        { this.props.children }
      </div>
    );
  }
}
