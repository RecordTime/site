import moment from 'moment';

/**
 * 
 * 首先要拿到时间区间
 * 从数据源计算想要展示的数据格式
 * HourDate = { [key: number，小时 ]: value: number，该小时工作时长 }
 * @param {*} dataSource 
 * @return {HourData} detail
 * @return {number} total 总共工作的毫秒数
 */
export function getChartData(dataSource) {
  const res = {};
  let total = 0;
  let timerTotal = 0;
  // 首先按小时计算，先列出 8 到 22 点的 x 轴
  for (let i = 0, l = dataSource.length; i < l; i += 1) {
    // 单条记录
    const record = dataSource[i];
    const startTime = new Date(record.beginTime).getTime();
    const endTime = new Date(record.endTime).getTime();
    const spend = endTime - startTime;
    console.log(spend, 25 * 60 * 1000);
    if (Math.floor(spend / 1000 / 60) === 25) {
      timerTotal += 1;
    }
    total += spend;
    console.log(startTime, endTime);
    // 看这条记录是否落在单个小时内
    const startHour = moment(startTime).hour();
    const endHour = moment(endTime).hour();
    console.log(startHour, endHour);
    if (startHour === endHour) {
      res[startHour] = (res[startHour] === undefined ? 0 : res[startHour]) + spend;
    } else {
      // 如果不在同一个小时内
      console.log(moment(startTime));
      const point = new Date(startTime).setHours(startHour + 1, 0, 0).valueOf();
      res[startHour] = (res[startHour] === undefined ? 0 : res[startHour]) + (point - startTime);
      res[endHour] = (res[endHour] === undefined ? 0 : res[endHour]) + (endTime - point);
    }
  }
  return {
    detail: res,
    total,
    // 几个番茄钟
    timerTotal,
  };
}

/**
 * 获取指定天，每个小时的毫秒区间
 * @param {*} date 
 */
export function getHourRange(date) {
  const range = {};
  for (let i = 0; i < 24; i += 1) {
    const start = moment(date).setHours(i, 0, 0);
    const end = moment(date).setHours(i, 59, 59);
    range[i] = [start, end];
  }
}

/** 
 * 将毫秒数转换为可读文本
 */
export function getTimeText(millisecond) {
  const tempTime = moment.duration(millisecond);
  const hourText = tempTime.hours() > 0 ? `${tempTime.hours()}小时` : '';
  return `${hourText}${tempTime.minutes()}分钟`;
}
