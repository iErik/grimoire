import React from 'react';

import TitleBar from './components/TitleBar';

export default class NotebooksPage extends React.Component {
  render() {
    return (
      <div className="collapse inner container">
        <section className="small-12 row columns">
          <TitleBar { ...this.props } />
        </section>
      </div>
    );
  }
}
