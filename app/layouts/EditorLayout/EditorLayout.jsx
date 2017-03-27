import React from 'react';
import ui from 'redux-ui';

@ui({
  state: {
    showSidebar: false
  }
})
export default class EditorLayout extends React.Component {
  render() {
    return (
      <main className="full container">
        { React.cloneElement(this.props.children, this.props) }
      </main>
    );
  }
}
