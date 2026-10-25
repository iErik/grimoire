import React from 'react'
import PropTypes from 'prop-types'
import { uiPropTypes } from 'utils/propShapes'
import classNames from 'classnames'
import ui from 'redux-ui'

@ui({
  state: {
    hideContents: false,
  }
})
export default class Panel extends React.Component {
  static propTypes = {
    ui: uiPropTypes.ui,
    updateUI: uiPropTypes.updateUI,
    panelName: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  }

  toggleContents() {
    this.props.updateUI('hideContents', !this.props.ui.hideContents)
  }

  render() {
    let styles = {
      panel: classNames({
        'panel': true,
        'is-hidden': this.props.ui.hideContents
      })
    }

    return (
      <div className={ styles.panel }>
        <div className="panel-control">
          <p className="panel-name">{ this.props.panelName }</p>
          <button className="btn-toggle"
            onClick={ this.toggleContents.bind(this) }>
            <i className="icn-arrow-up"></i>
          </button>
        </div>
        <div className="panel-contents-wrapper">
          <div className="panel-contents">
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}
