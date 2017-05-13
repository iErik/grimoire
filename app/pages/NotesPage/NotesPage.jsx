import React from 'react';

import TitleBar from './components/TitleBar';
import NotesList from './components/NotesList';
import NoteViewer from './components/NoteViewer';

export default class NotesPage extends React.Component {
  render() {
    return (
      <div className="collapse inner stack container">
        <section className="title-bar-container">
          <TitleBar { ...this.props } />
        </section>

        <section className="full-height expanded row">
          <section className="small-4 columns">
            <NotesList { ...this.props } />
          </section>
          <section className="small-8 columns">
            <NoteViewer { ...this.props } />
          </section>
        </section>
      </div>
    );
  }
}
