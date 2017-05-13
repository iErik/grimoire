import React from 'react';
import { keys } from 'underscore';

import TitleBar from './components/TitleBar';
import Panel from './components/Panel';

import SelectField from 'components/SelectField';
import TextField from 'components/TextField';

import { editorThemes, applicationThemes } from 'config/themes';
import { capitalize } from 'utils/stringTools';

export default class SettingsPage extends React.Component {
  render() {
    return (
      <div className="collapse inner stack container">
        <section className="title-bar-container">
          <TitleBar { ...this.props } />
        </section>
        <section className="full-height inner stack container align-middle background-light">
          <Panel panelName={ 'General' }>
            <div className="section">
              <label>UI Theme:</label>
              <SelectField
                value={{ label: capitalize(this.props.settings.appTheme) }}
                onChange={ this.props.changeApplicationTheme }

                options={ keys(applicationThemes).map((theme) => ({
                  label: capitalize(theme),
                  value: theme,
                  key:  `theme__${theme}`
                })) }
              />
            </div>
          </Panel>

          <Panel panelName={ 'Editor' }>
            <div className="section">
              <label>Font Size:</label>
              <TextField
                value={ this.props.settings.editorFontSize }
                onChange={ this.props.changeEditorFontSize }
                alignEnd={ true }
              />
            </div>

            <div className="section">
              <label>Light Theme:</label>
              <SelectField
                value={{ label: this.props.settings.editorTheme.light.label }}
                onChange={ this.props.changeEditorThemeLight }

                options={ editorThemes.light.map((theme) => ({
                  label: theme.label,
                  value: theme,
                  key: `theme__${theme.name}`
                })) }
              />
            </div>

            <div className="section">
              <label>Dark Theme:</label>
              <SelectField
                value={{ label: this.props.settings.editorTheme.dark.label }}
                onChange={ this.props.changeEditorThemeDark }

                options={ editorThemes.dark.map((theme) => ({
                  label: theme.label,
                  value: theme,
                  key: `theme__${theme.name}`
                })) }
              />
            </div>
          </Panel>
        </section>
      </div>
    );
  }
}
