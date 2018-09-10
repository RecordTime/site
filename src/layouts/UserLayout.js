/**
 * @file 基础布局
 * @author ltaoo
 */
import React from 'react';
import { Route, Link } from 'react-router-dom';
import {
  Layout,
} from 'antd';

import Login from '../routes/Login';
import Register from '../routes/Register';

export default class UserLayout extends React.PureComponent {
  render() {
    return (
      <Layout style={{ height: '100vh' }}>
        <Route path="/user/login" component={Login} />
        <Route path="/user/register" component={Register} />
      </Layout>
    );
  }
}
