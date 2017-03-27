import React from 'react';
import classNames from 'classnames';
import { Link, IndexLink } from 'react-router';

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
            <IndexLink className="nav-link" activeClassName="is-active"
              to="/dashboard">
              <i className="fa fa-file-text-o"></i>
            </IndexLink>
          </li>
          <li className="nav-entry">
            <Link className="nav-link" activeClassName="is-active"
              to="/dashboard/notebooks">
              <i className="fa fa-book"></i>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}
