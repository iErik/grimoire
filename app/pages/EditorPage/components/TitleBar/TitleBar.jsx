import React from 'react';

import BurgerButton from 'components/BurgerButton';
import WindowControls from 'components/WindowControls';

export default (props) => {
  const { editorActions } = props;

  const toggleSidebar = () => {
    props.updateUI('showSidebar', !props.ui.showSidebar);
  }

  return (
    <div className="editor-title-bar">
      <div className="sidebar-trigger-container">
        <div className="sidebar-trigger">
          <BurgerButton
            isActive={ props.ui.showSidebar }
            onClick={ toggleSidebar }
          />
        </div>
      </div>

      <div className="actions-container draggable">
        <div className="inner">
          <div className="action-container">
            <button className="btn" onClick={ editorActions.insertBold }>
              <i className="fa fa-bold"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn" onClick={ editorActions.insertItalic }>
              <i className="fa fa-italic"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn" onClick={ editorActions.insertStrikethrough }>
              <i className="fa fa-underline"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn" onClick={ editorActions.insertUnorderedList }>
              <i className="fa fa-list-ul"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn" onClick={ editorActions.insertOrderedList }>
              <i className="fa fa-list-ol"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn" onClick={ editorActions.insertLink }>
              <i className="fa fa-link"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn" onClick={ editorActions.insertQuote }>
              <i className="fa fa-quote-left"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn">
              <i className="fa fa-align-left"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn">
              <i className="fa fa-align-center"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn">
              <i className="fa fa-align-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="window-controls-container">
        <WindowControls { ...props } />
      </div>
    </div>
  );
}
