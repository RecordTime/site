/**
 * @file 基础布局
 * @author ltaoo
 */
import React from 'react';
import { Route, Link } from 'react-router-dom';
import {
  Avatar,
  Icon,
  Layout,
  Menu,
  Dropdown,
} from 'antd';
import AV from 'leancloud-storage';

import Home from '../routes/Home';
import Report from '../routes/Report';

const { Sider, Header, Content } = Layout;

export default class BasicLayout extends React.PureComponent {
  componentDidMount() {
    const currentUser = AV.User.current();
    console.log(currentUser);
    if (!currentUser) {
      this.props.history.push('/user/login');
    }
  }
  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to="/report"><Icon type="setting" theme="outlined" />设置</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Link to="/logout"><Icon type="logout" theme="outlined" /><span>退出登录</span></Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout style={{ height: '100vh' }}>
        <Header style={{ padding: '0 10px', height: 48, lineHeight: '48px', background: 'none' }}>
          <div style={{ float: 'right', cursor: 'pointer' }}>
            <Dropdown overlay={menu}>
              <Avatar icon="user" />
            </Dropdown>
          </div>
        </Header>
        <Layout style={{ height: '100%', paddingBottom: 10 }}>
          <Sider style={{ background: 'none' }}>
            <p>侧边栏</p>
          </Sider>
          <Content style={{ padding: '0 10px', height: '100%' }}>
            <Route path="/" exact={true} component={Home} />
            <Route path="/report" component={Report} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
