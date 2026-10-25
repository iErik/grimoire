import React from 'react'
import PropTypes from 'prop-types'

const Editor = ({ children }) => (
  <div className="editor">
    { children }
  </div>
)

Editor.propTypes = {
  children: PropTypes.node.isRequired
}

export default Editor
