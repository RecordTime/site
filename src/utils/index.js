import moment from 'moment';

/**
 * 首先要拿到时间区间
 * 从数据源计算想要展示的数据格式
 * HourDate = { [key: number，小时 ]: value: number，该小时工作时长 }
 * @param {Log[]} dataSource 
 * @return {HourData} data
 * @return {number} time 总共工作的毫秒数
 * @return {number} total 满足 25 分钟的 log 数
 */
export function getChartData(dataSource) {
  let minutes = 0;
  let total = 0;
  const data = {};
  for (let i = 0, l = dataSource.length; i < l; i += 1) {
    // 单条记录
    const log = dataSource[i];
    const startTime = new Date(log.beginTime);
    const startHour = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const endTime = new Date(log.endTime);
    const endHour = endTime.getHours();
    const endMinutes = endTime.getMinutes();
    let spendTime = 0;
    // 如果该次 log 是在同一个小时内
    if (startHour === endHour) {
      spendTime = endMinutes - startMinutes;
      data[startHour] = (data[startHour] === undefined ? 0 : data[startHour]) + spendTime;
    } else {
      // 如果不在同一个小时内
      spendTime = (60 - startMinutes) + endMinutes;
      data[startHour] = (data[startHour] === undefined ? 0 : data[startHour]) + (60 - startMinutes);
      data[endHour] = (data[endHour] === undefined ? 0 : data[endHour]) + (endMinutes);
    }
    console.log(startHour, endHour, startMinutes, endMinutes, spendTime);
    minutes += spendTime;
    if (spendTime === 25) {
      total += 1;
    }
  }
  return {
    data,
    // 几个番茄钟
    total,
    // 总时长
    minutes,
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
 * 将分钟转换为可读文本
 * @param {number} minutes - 分钟数
 */
export function getTimeText(minutes) {
  const temp = moment.duration(minutes * 60 * 1000);
  const hourText = temp.hours() > 0 ? `${temp.hours()}h` : '';
  return `${hourText} / ${temp.minutes()}min`;
}
