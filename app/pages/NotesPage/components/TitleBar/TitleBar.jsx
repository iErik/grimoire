import React from 'react';

import { productName as APP_NAME } from 'app/package';

import BurgerButton from 'components/BurgerButton';
import SelectGroup from 'components/SelectGroup';
import WindowControls from 'components/WindowControls';

export default class TitleBar extends React.Component {
  createNote() {
    this.props.selectNextNote();
    this.props.createNote(this.props.activeNotebook._id);
  }

  toggleSidebar() {
    this.props.updateUI('showSidebar', !this.props.ui.showSidebar);
  }

  mapActiveNotebook() {
    return {
      label: this.props.activeNotebook.name,
      value: this.props.activeNotebook._id
    }
  }

  mapNotebooks() {
    return this.props.notebooks.map((notebook) => ({
      label: notebook.name,
      value: notebook._id
    }));
  }

  renderNotebookSelector() {
    return (
      <SelectGroup
        value={ this.mapActiveNotebook() }
        options={ this.mapNotebooks() }
        onChange={ this.props.changeActiveNotebook }
       />
     );
  }

  renderNotesActions() {
    if (this.props.selectedNote) {
      return (
        <div className="actions-container">
          <div className="action-container">
            <button className="btn" onClick={ this.createNote.bind(this) }>
              <i className="fa fa-plus"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn"
              onClick={ this.props.editNote.bind(null, this.props.selectedNote) }>
              <i className="fa fa-pencil-square-o"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn"
              onClick={ this.props.deleteNote.bind(null, this.props.selectedNote) }>
              <i className="fa fa-trash-o"></i>
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="actions-container">
          <div className="action-container" onClick={ this.createNote.bind(this) }>
            <button className="btn">
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="notes-title-bar">
        <div className="small-4 row columns">
          <div className="control-container" >
            <BurgerButton
              isActive={ this.props.ui.showSidebar }
              onClick={ this.toggleSidebar.bind(this) }
            />
          </div>
          <div className="notebook-actions columns">
            <div className="control-container">
              <button className="btn">
                <i className="fa fa-search"></i>
              </button>
            </div>
            <div className="notebooks-selector">
              { this.props.isStoreLoading
              ? ''
              : this.renderNotebookSelector()
              }
            </div>
          </div>
        </div>

        <div className="draggable note-actions small-8 columns">

          { this.renderNotesActions() }

          <div className="title-container">
            <p className="title">{ APP_NAME }</p>
          </div>

          <div className="wrapper-window-controls">
            <WindowControls { ...this.props } />
          </div>

        </div>
      </div>
    );
  }
}
