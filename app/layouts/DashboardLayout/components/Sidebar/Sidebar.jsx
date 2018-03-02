import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

export default class Sidebar extends React.Component {
  render() {
    let classState = classNames({
      'narrow-sidebar': true,
      'is-active': this.props.ui.showSidebar,
    })

    return (
      <nav className={ classState }>
        <ul className="nav-entries">
          <li className="nav-entry">
            <NavLink className="nav-link" exact={true} activeClassName="is-active"
              to="/dashboard">
              <i className="icn-newspaper"></i>
            </NavLink>
          </li>
          <li className="nav-entry">
            <NavLink className="nav-link" exact={true} activeClassName="is-active"
              to="/dashboard/notebooks">
              <i className="icn-notebook"></i>
            </NavLink>
          </li>
          <li className="nav-entry">
            <NavLink className="nav-link" exact={true} activeClassName="is-active"
              to="/dashboard/settings">
              <i className="icn-gear"></i>
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}
