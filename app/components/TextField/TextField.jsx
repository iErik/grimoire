import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Input from 'components/Input';

export default class TextField extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    alignEnd: PropTypes.bool
  }

  onChange(ev) {
    this.props.onChange(ev.target.value);
  }

  render() {
    let style = classNames({
      'text-field': true,
      'align-end': this.props.alignEnd
    })

    return (
      <Input
        type="text"
        className={ style }
        onChange={ this.onChange.bind(this) }
        value={ this.props.value }
      />
    );
  }
}
