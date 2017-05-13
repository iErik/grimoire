import React, { PropTypes } from 'react';
import ui from 'redux-ui';
import classNames from 'classnames';

@ui({
  state: {
    showOptions: false
  }
})
export default class SelectField extends React.Component {
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
      <li className="select-field-option" key={ option.key }
        onClick={ this.onChange.bind(this, option.value) }>
        <span className="option-label">{ option.label }</span>

        { option.key === this.props.value.key
        ? <i className="icn-check"></i>
        : ''
        }
      </li>
    ));
  }

  render() {
    let styles = {
      selectField: classNames({
        'inner-select-field': true,
        'is-active': this.props.ui.showOptions
      })
    }

    return (
      <div className="select-field">
        <div className={ styles.selectField }>
          <div className="select-field-value"
            onClick={ this.toggleOptions.bind(this) }>
            <span className="value-label">{ this.props.value.label }</span>
            <button className="btn">
              <i className="icn-arrow-down"></i>
            </button>
          </div>
          <div className="select-field-options">
            <ul className="entries">
              { this.renderOptions() }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
