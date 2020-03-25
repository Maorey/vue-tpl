/*
 * @Description: 日期格式化/反格式化 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 12:58:37
 */
import formatDate, {
  getDate,
  getWeek,
  getMonth,
  getYear,
} from '@/utils/formatDate'

describe('@/utils/formatDate: 日期格式化/反格式化', () => {
  const DATE = new Date(2019, 6, 3, 17, 17, 11, 111)

  const FORMAT = '今天是yyyy年MM月dd日ww 现在是tthh点mm分ss秒nnn毫秒'
  const RESULT = '今天是2019年07月03日星期三 现在是下午05点17分11秒111毫秒'

  const FORMAT1 = 'yyyy\\year'
  const RESULT1 = '2019year'

  it('formatDate 指定格式格式化日期(Date)为字符串', () => {
    expect(formatDate(DATE, FORMAT)).toBe(RESULT)
    expect(formatDate(DATE, FORMAT1)).toBe(RESULT1)
  })

  it('getDate 指定格式反格式化字符串为日期(Date)', () => {
    expect((getDate(RESULT, FORMAT) as Date).getTime()).toBe(DATE.getTime())
    expect((getDate(RESULT1, FORMAT1) as Date).getFullYear()).toBe(2019)
  })

  function isEqual(result: string[], target: string[]) {
    for (let i = 0; i < result.length; i++) {
      if (result[i] !== target[i]) {
        return false
      }
    }
    return true
  }

  it('getWeek 获取本周起止日期字符串数组', () => {
    expect(
      isEqual(getWeek(DATE, FORMAT), [
        '今天是2019年07月01日星期一 现在是下午05点17分11秒111毫秒',
        '今天是2019年07月07日星期日 现在是下午05点17分11秒111毫秒',
      ])
    ).toBe(true)
    expect(
      isEqual(getWeek(DATE, FORMAT, true), [
        '今天是2019年07月01日星期一 现在是下午05点17分11秒111毫秒',
        RESULT,
      ])
    ).toBe(true)
    expect(
      isEqual(getWeek(RESULT, FORMAT, true), [
        '今天是2019年07月01日星期一 现在是下午05点17分11秒111毫秒',
        RESULT,
      ])
    ).toBe(true)
  })

  it('getMonth 获取本月起止日期字符串数组', () => {
    expect(
      isEqual(getMonth(DATE, FORMAT), [
        '今天是2019年07月01日星期一 现在是下午05点17分11秒111毫秒',
        '今天是2019年07月31日星期三 现在是下午05点17分11秒111毫秒',
      ])
    ).toBe(true)
    expect(
      isEqual(getMonth(DATE, FORMAT, true), [
        '今天是2019年07月01日星期一 现在是下午05点17分11秒111毫秒',
        RESULT,
      ])
    ).toBe(true)
    expect(
      isEqual(getMonth(RESULT, FORMAT, true), [
        '今天是2019年07月01日星期一 现在是下午05点17分11秒111毫秒',
        RESULT,
      ])
    ).toBe(true)
  })

  it('getYear 获取今年起止日期字符串数组', () => {
    expect(
      isEqual(getYear(DATE, FORMAT), [
        '今天是2019年01月01日星期二 现在是下午05点17分11秒111毫秒',
        '今天是2019年12月31日星期二 现在是下午05点17分11秒111毫秒',
      ])
    ).toBe(true)
    expect(
      isEqual(getYear(DATE, FORMAT, true), [
        '今天是2019年01月01日星期二 现在是下午05点17分11秒111毫秒',
        RESULT,
      ])
    ).toBe(true)
    expect(
      isEqual(getYear(RESULT, FORMAT, true), [
        '今天是2019年01月01日星期二 现在是下午05点17分11秒111毫秒',
        RESULT,
      ])
    ).toBe(true)
  })
})
