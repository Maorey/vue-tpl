/** 数据格式 */

/** 时间日期格式 serverCase:提交服务端与服务端返回 */
export const enum DateTime {
  serverDate = 'yyyy-MM-dd',
  serverTime = 'HH:mm:ss',
  serverTimeShort = 'HH:mm',
  serverDateTime = 'yyyy-MM-dd HH:mm:ss',
  serverDateTimeShort = 'yyyy-MM-dd HH:mm',
  date = 'yyyy 年 M 月 d 日',
  time = 'HH:mm:ss',
  timeShort = 'HH:mm',
  dateTime = 'yyyy/MM/dd HH:mm:ss',
  dateTimeShort = 'yyyy/MM/dd HH:mm',
}

/** 时间日期格式字典 serverCase:提交服务端与服务端返回 */
export const DATE_TIME = {
  serverDate: DateTime.serverDate,
  serverTime: DateTime.serverTime,
  serverTimeShort: DateTime.serverTimeShort,
  serverDateTime: DateTime.serverDateTime,
  serverDateTimeShort: DateTime.serverDateTimeShort,
  date: DateTime.date,
  time: DateTime.time,
  timeShort: DateTime.timeShort,
  dateTime: DateTime.dateTime,
  dateTimeShort: DateTime.dateTimeShort,
}
