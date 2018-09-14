/** 
 * @file 统计
 * @author ltaoo
 */
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  Card,
  Table,
} from 'antd';
import AV from 'leancloud-storage';

import { 
  ChartCard, 
  Bar,
} from '../../components/Charts';
import EmptyContainer from '../../components/EmptyTipContainer';
import { getChartData, getTimeText, getMinutes } from '../../utils';

import './index.css';

const TASK_CLASS = 'Task';
const LOG_CLASS = 'Log';

/**
 * 获取指定天的时间戳范围
 * @param {string} date - 指定天
 */
function getDayRange(date) {
  const start = new Date(date).setHours(0, 0 ,0);
  const end = new Date(date).setHours(23, 59 ,59);
  return [start.valueOf(), end.valueOf()];
}

function format(date, formatter='HH:mm') {
  return moment(date).format(formatter);
}

const columns = [
  {
    title: '开始时间',
    dataIndex: 'beginTime',
    render: date => format(Number(date)),
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    render: date => format(Number(date)),
  },
  {
    title: '关联任务',
    dataIndex: 'task',
    render: (val, item) => {
      return val && <Link to={`/task/${val.uid}`}>{val.title}</Link>;
    }
  },
  {
    title: '描述',
    dataIndex: 'content',
  },
];

export default class ReportPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      dataSource: [],
      groupedByTaskDataSource: {},
    };
  }
  componentDidMount() {
    const today = moment().format('YYYY-MM-DD');
    const [starttime, endtime] = getDayRange(today);
    this.fetch({
      starttime,
      endtime,
    });
  }
  async fetch ({ starttime, endtime }) {
    const user = AV.User.current();
    const query = new AV.Query(LOG_CLASS);
    query.equalTo('creator', user);
    query.greaterThanOrEqualTo('createdAt', new Date(starttime));
    query.lessThanOrEqualTo('createdAt', new Date(endtime));
    query.include('task');
    query.find()
      .then((res) => {
        console.log(res);
        /**
         * interface Log {
         *  id: String;
         *  uid: Number;
         *  beginTime: Date;
         *  endTime: Date;
         *  task: null | Task;
         * }
         * interface Task {
         *  id: String;
         *  uid: Number;
         *  title: String;
         *  desc: String;
         *  isComplete: Boolean;
         *  borad: String;
         * }
         */
        const tasks = {};
        const dataSource = res.map(item => {
          const serverTask = item.get('task');
          let task = undefined;
          if (serverTask) {
            task = {
              id: serverTask.id,
              ...serverTask.attributes,
            }
            tasks[task.id] = task;
          }
          return {
            id: item.id,
            ...item.attributes,
            task,
          };
        });
        const groupedByTaskDataSource = dataSource.reduce((prev, next) => {
          const r = {
          };
          if (next.task) {
            if (prev[next.task.id]) {
              r[next.task.id] = prev[next.task.id].concat(next);
            } else {
              r[next.task.id] = [next];
            }
          } else {
            prev.empty.push(next);
          }
          return {
            ...prev,
            ...r,
          };
        }, { empty: [] });
        console.log(tasks, groupedByTaskDataSource);
        // 需要能根据任务将 log 聚合
        const { data, total, minutes } = getChartData(dataSource);
        const chartData = [];
        Object.keys(data).forEach(hour => {
          chartData.push({
            x: `${hour}:00`,
            y: data[hour],
          });
        });
        this.setState({
          dataSource,
          data: chartData,
          groupedByTaskDataSource,
          tasks,
          total,
          minutes,
          loading: false,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const { loading, dataSource, data, minutes, total, groupedByTaskDataSource, tasks } = this.state;

    const title = `${getTimeText(minutes)}   total: ${total}`;
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div className="report__content" style={{ flex: 1, overflowY: 'auto', padding: 10, marginRight: 10, borderRadius: 10, background: '#fff' }}>
          <ChartCard
            head={<span style={{ lineHeight: '32px' }}>每小时工作时长趋势</span>}
            loading={loading}
            style={{ marginBottom: 20 }}
            title={title}
          >
            <Bar height={292} data={data} />
          </ChartCard>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
          <ul style={{ listStyle: 'none' }}>
            {Object.keys(groupedByTaskDataSource).map(id => {
              const logs = groupedByTaskDataSource[id];
              const minutes = logs.reduce((prev, next) => {
                const minutes = getMinutes(new Date(next.beginTime), new Date(next.endTime), true);
                return prev + minutes;
              }, 0);
              const text = getTimeText(minutes);
              return (
                <li>
                  <span>{text}</span> - <span>{tasks[id] ? tasks[id].title : id}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div style={{ flex: 1, padding: 10, borderRadius: 10, background: '#fff' }}>
          <EmptyContainer title="请选择任务查看详情" />
        </div>
      </div>
    );
  }
}
