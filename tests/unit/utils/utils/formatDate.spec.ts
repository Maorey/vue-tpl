/*
 * @Description: 日期格式化/反格式化 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 12:58:37
 */
import formatDate, { getDateByString } from '@/utils/utils/formatDate'

describe('@/utils/utils/formatDate: 日期格式化/反格式化', () => {
  const DATE = new Date(2019, 6, 3, 17, 17, 11, 111)

  const FORMAT = '今天是yyyy年MM月dd日ww 现在是tthh点mm分ss秒nnn毫秒'
  const RESULT = '今天是2019年07月03日星期三 现在是下午05点17分11秒111毫秒'

  const FORMAT1 = 'yyyy\\year'
  const RESULT1 = '2019year'

  it('formatDate 指定格式格式化日期(Date)为字符串', () => {
    expect(formatDate(DATE, FORMAT)).toBe(RESULT)
    expect(formatDate(DATE, FORMAT1)).toBe(RESULT1)
  })
  it('getDateByString 指定格式反格式化字符串为日期(Date)', () => {
    expect((getDateByString(RESULT, FORMAT) as Date).getTime()).toBe(
      DATE.getTime()
    )
    expect((getDateByString(RESULT1, FORMAT1) as Date).getFullYear()).toBe(2019)
  })
})
