import React from 'react';
import PropTypes from 'prop-types';
import ui from 'redux-ui';
import classNames from 'classnames';
import { isEqual } from 'underscore';

/*
 * TODO: Use the SelectField component and integrate it with
 * a search bar.
 */

@ui({
  state: {
    showOptions: false
  }
})
export default class NotebooksField extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.object
  }

  onChange(option) {
    this.props.onChange(option);
    this.props.updateUI('showOptions', false);
  }

  toggleOptions() {
    this.props.updateUI('showOptions', !this.props.ui.showOptions);
  }

  renderOptions() {
    return this.props.options.map((option) => (
      <div className="select-field-option" key={ option.key }
        onClick={ this.onChange.bind(this, option.value) }>
        <span className="option-label">{ option.label }</span>

        { option.key === this.props.value.key
        ? <i className="icn-check"></i>
        : ''
        }
      </div>
    ));
  }

  render() {
    let styles = {
      select: classNames({
        'notebooks-field': true,
        'is-active': this.props.ui.showOptions
      })
    }

    return (
      <div className={ styles.select }>
        <div className="select-field-value" onClick={ this.toggleOptions.bind(this) }>
          <span className="value-label">{ this.props.value.label }</span>
          <button className="btn"><i className="icn-arrow-down"></i></button>
        </div>
        <div className="select-field-options">
          <div className="entries">
            { this.renderOptions() }
          </div>
        </div>
      </div>
    );
  }
}
