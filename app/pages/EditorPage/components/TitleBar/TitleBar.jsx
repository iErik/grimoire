import React from 'react'
import PropTypes from 'prop-types'
import { uiPropTypes } from 'utils/propShapes'

import BurgerButton from 'components/BurgerButton'
import WindowControls from 'components/WindowControls'

const TitleBar = (props) => {
  const { editorActions } = props

  const toggleSidebar = () => {
    props.updateUI('showSidebar', !props.ui.showSidebar)
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
            <button
              className="btn"
              onClick={ editorActions.insertBold }>
              <i className="icn-bold"></i>
            </button>
          </div>
          <div className="action-container">
            <button
              className="btn"
              onClick={ editorActions.insertItalic }>
              <i className="icn-italic"></i>
            </button>
          </div>
          <div className="action-container">
            <button
              className="btn"
              onClick={ editorActions.insertStrikethrough }>
              <i className="icn-strikethrough"></i>
            </button>
          </div>
          <div className="action-container">
            <button
              className="btn"
              onClick={ editorActions.insertUnorderedList }>
              <i className="icn-ul-list"></i>
            </button>
          </div>
          <div className="action-container">
            <button
              className="btn"
              onClick={ editorActions.insertOrderedList }>
              <i className="icn-ol-list"></i>
            </button>
          </div>
          <div className="action-container">
            <button
              className="btn"
              onClick={ editorActions.insertLink }>
              <i className="icn-link-o"></i>
            </button>
          </div>
          <div className="action-container">
            <button
              className="btn"
              onClick={ editorActions.insertQuote }>
              <i className="icn-quote-left"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn">
              <i className="icn-align-left"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn">
              <i className="icn-align-center"></i>
            </button>
          </div>
          <div className="action-container">
            <button className="btn">
              <i className="icn-align-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="window-controls-container">
        <WindowControls { ...props } />
      </div>
    </div>
  )
}

TitleBar.propTypes = {
  ui: uiPropTypes.ui,
  updateUI: uiPropTypes.updateUI,
  editorActions: PropTypes.objectOf(PropTypes.func).isRequired
}

export default TitleBar
