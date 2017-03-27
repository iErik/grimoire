import React, { PropTypes } from 'react';
import ui from 'redux-ui';
import classNames from 'classnames';

@ui({
  state: {
    showOptions: false
  }
})
export default class SelectGroup extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.object
  }

  onChange(option) {
    this.props.onChange(option);
    this.props.updateUI('showOptions', false);
  }

  renderOptions() {
    return this.props.options.map((option) => {
      return (
        <div className="select-option" key={ option.value }
          onClick={ this.onChange.bind(this, option.value) }>
          <span className="option-label">{ option.label }</span>
        </div>
      );
    });
  }

  toggleOptions() {
    this.props.updateUI('showOptions', !this.props.ui.showOptions);
  }

  render() {
    let styles = {
      select: classNames({
        'select': true,
        'is-active': this.props.ui.showOptions
      })
    }

    return (
      <div className={ styles.select }>
        <div className="select-value" onClick={ this.toggleOptions.bind(this) }>
          <span className="value-label">{ this.props.value.label }</span>
          <button className="btn"><i className="fa"></i></button>
        </div>
        <div className="select-options">
          <div className="entries">
            { this.renderOptions() }
          </div>
        </div>
      </div>
    );
  }
}
