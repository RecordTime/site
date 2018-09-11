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
import { getChartData, getTimeText } from '../../utils';

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

const URL_REGEXP = new RegExp('[a-zA-z]+://[^]*');
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
      console.log(val, item);
      return <Link to={`/task/${val.uid}`}>{val.title}</Link>;
    }
  },
  {
    title: '描述',
    dataIndex: 'content',
  },
  {
    title: '时长',
    dataIndex: 'length',
  },
];

export default class ReportPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      dataSource: [],
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
        const dataSource = res.map(item => {
          return {
            ...item.attributes,
            task: {
              ...item.get('task').attributes,
            },
          };
        });
        const { detail: data, total, timerTotal } = getChartData(dataSource);
        console.log(dataSource, data, total);
        const chartData = [];
        Object.keys(data).forEach(hour => {
          chartData.push({
            x: `${hour}:00`,
            y: Math.floor(data[hour] / 1000 / 60),
          });
        });
        this.setState({
          dataSource,
          data: chartData,
          total,
          timerTotal,
          loading: false,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const { loading, dataSource, data } = this.state;
    return (
      <div style={{ display: 'flex', padding: 20, height: '100%' }}>
        <div className="report__content" style={{ flex: 1, overflowY: 'auto', padding: 10, marginRight: 10, borderRadius: 10, background: '#fff' }}>
          <ChartCard
            head={<span style={{ lineHeight: '32px' }}>每小时工作时长趋势</span>}
            // loading={loading}
            style={{ marginBottom: 20 }}
            // title={title}
            // extra={(
            //   <DatePicker onChange={this.handleChangeDate} />
            // )}
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
        </div>
        <div style={{ flex: 1, padding: 10, borderRadius: 10, background: '#fff' }}>
          <EmptyContainer title="请选择任务查看详情" />
        </div>
      </div>
    );
  }
}
