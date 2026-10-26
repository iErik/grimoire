import React from 'react'
import PropTypes from 'prop-types'
import { orEmpty } from 'utils/stringTools'

export default class Input extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = { value: orEmpty(props.value) }
  }

  componentWillReceiveProps(nextProps) {
    const value = orEmpty(nextProps.value)

    if (this.state.value !== value)
      this.setState({ value })
  }

  onChange(ev) {
    ev.persist()
    this.setState(
      { value: ev.target.value },
      () => this.props.onChange(ev)
    )
  }

  render() {
    return (
      <input
        { ...this.props }
        { ...this.state }
        onChange={ this.onChange.bind(this) }
      />
    )
  }
}
