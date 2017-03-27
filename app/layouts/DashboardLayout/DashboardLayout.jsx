import React from 'react';
import ui from 'redux-ui';

import Sidebar from './components/Sidebar';

@ui({
  state: {
    showSidebar: false,
  }
})
export default class DashboardLayout extends React.Component {
  render() {
    return (
      <div className="full container">
        <Sidebar { ...this.props } />

        <main className="inner container">
          { React.cloneElement(this.props.children, this.props) }
        </main>
      </div>
    );
  }
}
