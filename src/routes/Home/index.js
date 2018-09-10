/**
 * @file 首页
 * @author ltaoo
 */
import React from 'react';
import { Route } from 'react-router-dom';

import TaskPanel from '../../components/TaskPanel';
import EmptyContainer from '../../components/EmptyTipContainer';

export default class Home extends React.Component {
  render() {
    return (
      <div style={{ display: 'flex', height: '100%', }}>
        <div style={{ flex: 1, padding: 10, marginRight: 10, borderRadius: 10, background: '#fff' }}>
          <TaskPanel />
        </div>
        <div style={{ flex: 1, padding: 10, borderRadius: 10, background: '#fff' }}>
          <EmptyContainer title="请选择任务查看详情" />
        </div>
      </div>
    );
  }
}
