import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';

export default class RouterConfig extends React.PureComponent {
  render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/user"
            render={(props) => {
              return <UserLayout {...props} />
            }}
          />
          <Route
            path="/"
            render={(props) => {
              return <BasicLayout {...props} />
            }}
          />
        </Switch>
      </Router>
    );
  }
}
