/**
 * @file 单个任务条目
 * @author ltaoo
 */
import React from 'react';
import {
  Checkbox,
} from 'antd';

export default class Task extends React.PureComponent {
  render() {
    const { title, complete } = this.props.data;
    return (
      <div>
        <Checkbox checked={complete} />
        <input style={{ display: 'inline-blcok', color: '#333' }} value={title} />
      </div>
    );
  }
}
