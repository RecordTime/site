import React from 'react';
import { Link } from 'react-router-dom';
import {
  Icon,
  Form,
  Input,
  Button,
} from 'antd';
import AV from 'leancloud-storage';

import './index.css';

@Form.create()
export default class LoginPage extends React.PureComponent {
  login = async () => {
    const { getFieldsValue } = this.props.form;
    const { username, password } = getFieldsValue();
    console.log(username, password);
    try {
      await AV.User.logIn(username, password);
      this.props.history.replace('/');
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={this.login} className="login-form-button">
            Log in
          </Button>
          Or <Link to="/user/register">register now</Link>
        </Form.Item>
      </Form>
    );
  }
}
