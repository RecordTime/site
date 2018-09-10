/**
 * @file 单个任务面板，包括展开收起、任务列表
 * @author ltaoo
 */
import React from 'react';
import {
  Icon,
} from 'antd';

import Tasks from '../Tasks';

export default class TaskPanel extends React.PureComponent {
  render() {
    return (
      <div>
        <span style={{ fontSize: 14 }}>
          <span style={{ display: 'inline-block', marginRight: 10, cursor: 'pointer' }}>
            <Icon type="caret-right" theme="filled" />
          </span>
          <span style={{ display: 'inline-block' }}>周一，今天</span>
        </span>
        <Tasks dataSource={[{ title: '我能用滴答清单做什么？', complete: false }]} />
      </div>
    );
  }
}
