import React, { PropTypes } from 'react';

export default class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: props.value };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value)
      this.setState({ value: nextProps.value });
  }

  onChange(ev) {
    ev.persist();
    this.setState({ value: ev.target.value }, () => this.props.onChange(ev));
  }

  render() {
    return (
      <input
        { ...this.props }
        { ...this.state }
        onChange={ this.onChange.bind(this) }
      />
    );
  }
}
