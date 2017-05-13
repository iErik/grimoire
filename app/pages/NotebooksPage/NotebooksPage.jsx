import React from 'react';

import TitleBar from './components/TitleBar';
import NotebookGrid from './components/NotebookGrid';

export default class NotebooksPage extends React.Component {
  render() {
    return (
      <div className="collapse inner stack container">
        <section className="title-bar-container">
          <TitleBar { ...this.props } />
        </section>

        <section className="full-height expanded row background-light">
          <NotebookGrid { ...this.props } />
        </section>
      </div>
    );
  }
}
