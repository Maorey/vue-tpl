/*
 * @Description: 日期格式化/反格式化 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 12:58:37
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-03 17:22:26
 */
import formatDate, { getDateByString } from '@/utils/utils/formatDate'

const DATE = new Date(2019, 6, 3, 17, 17, 11, 111)
const FORMAT = '今天是yyyy年MM月dd日ww 现在是tthh点mm分ss秒nnn毫秒'
const RESULT = '今天是2019年07月03日星期三 现在是下午05点17分11秒111毫秒'

test('formatNumber', () => {
  expect(formatDate(DATE, FORMAT)).toBe(RESULT)
  expect(getDateByString(RESULT, FORMAT).getTime()).toBe(DATE.getTime())
})
