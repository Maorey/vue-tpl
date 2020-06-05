/*
 * @Description: 日期格式化/反格式化
 * @Author: 毛瑞
 * @Date: 2019-06-27 12:58:37
 */
import { isString, isNumber } from '.'
import { Memory } from './storage'

/** 日期格式化字符串, 保留字如下(允许使用转义字符\来输出保留字):
 *
 *  y: 一到四位，表示年 比如 yyyy=2018 yyy=018 yy=18 y=8
 *
 *  M: 一到二位，表示月 MM: 始终两位数字 比如7月 => 07 (MM) 7 (M)
 *
 *  d: 一到二位，表示日
 *
 *  w: 一到二位，表示周，比如 w=周四 ww=星期四
 *
 *  h: 一到二位，表示12小时制的小时
 *
 *  H: 一到二位，表示24小时制的小时
 *
 *  t: 一到二位，表示上午或下午 t=下 tt=下午
 *
 *  m: 一到二位，表示分钟
 *
 *  s: 一到二位，表示秒钟
 *
 *  n: 一到三位，表示毫秒数
 */
type format = string

/** 保留字枚举 */
const enum Reserve {
  // 年月日星期
  year = 'y',
  month = 'M',
  day = 'd',
  week = 'w',

  // 时分秒毫秒
  hour = 'h', // 12小时制
  Hour = 'H', // 24小时制
  slot = 't', // 上午或下午
  minute = 'm',
  second = 's',
  milliSecond = 'n',
}

/** 分组结果 */
interface IGroup {
  /** 保留字 */
  k: string
  /** 保留字重复次数 */
  l: number
  /** 在原format字符串的索引 */
  i?: number
}
/** 格式处理结果 */
interface IResult {
  /** 正则表达式字符串 */
  t: string
  /** 正则表达式 */
  r: RegExp
  /** 分组 */
  g: IGroup[]
}

/** 保留字串 */
const RESERVED =
  Reserve.year +
  Reserve.month +
  Reserve.day +
  Reserve.week +
  Reserve.hour +
  Reserve.Hour +
  Reserve.slot +
  Reserve.minute +
  Reserve.second +
  Reserve.milliSecond
/** 正则表达式保留字 */
const RESERVE_REG = '`|{}[]()*?+.^$!'
/** 转义字符 */
const ESCAPE = '\\'
/** 格式处理结果缓存 */
const CACHE = new Memory()
/** 获取保留字最大重复次数
 * @param {String} char 目标字符
 *
 * @returns {number}
 */
const getReserveMaxRepeat = (char: string) => {
  switch (char) {
    case Reserve.year:
      return 4
    case Reserve.milliSecond:
      return 3
    default:
      return 2
  }
}
/** 获取日期格式化对象，允许使用转义字符 \ 来输出保留字
 * @param {format} format 日期格式
 *
 * @returns {IResult} 格式处理结果
 */
function getFormat(format: format): IResult {
  const result: IResult | any = CACHE.get(format)
  if (result) {
    return result
  }

  const LENGTH = format.length
  const group: IGroup[] = []
  let reserveRepeat: number
  let reserveMaxRepeat: number
  let regString = ''
  let currentChar: string
  let nextChar: string
  let index = 0
  while (index < LENGTH) {
    currentChar = format[index]

    if (currentChar === ESCAPE) {
      // 转义字符
      nextChar = format[index + 1]

      if (RESERVED.includes(nextChar)) {
        regString += nextChar
        index++ // 跳过下个字符
      } else {
        regString += ESCAPE + currentChar
      }
    } else if (RESERVE_REG.includes(currentChar)) {
      // 正则表达式保留字
      regString += ESCAPE + currentChar
    } else if (RESERVED.includes(currentChar)) {
      // 保留字 替换为数字正则并记录信息
      reserveRepeat = 1
      reserveMaxRepeat = getReserveMaxRepeat(currentChar)

      while (
        reserveRepeat <= reserveMaxRepeat &&
        currentChar === format[index + 1]
      ) {
        reserveRepeat++
        index++
      }

      group.push({ k: currentChar, l: reserveRepeat })
      regString += `(\\d{1,${reserveRepeat}})`
    } else {
      // 其他字符
      regString += currentChar
    }

    index++
  }

  return CACHE.set(format, {
    t: regString,
    r: new RegExp(`^${regString}$`),
    g: group,
  })
}

const ISO_DATE_FORMAT = 'yyyy-MM-ddTHH:mm:ss.nnnZ'
const WEEK = '日一二三四五六'
// getFormat(ISO_DATE_FORMAT) // warm 下
const REG_NUM_REG = /\(\\d\{\d(,\d)?\}\)/g
const REG_RESERVE = new RegExp(
  `\\\\([${RESERVE_REG.replace(']', '\\]\\\\')}])`,
  'g'
)
/** 获得指定格式的日期字符串
 * @test true
 *
 * @param {Date|number} date 日期对象|时间戳
 * @param {format} format 日期格式
 *
 * @returns {String} 格式化的日期
 */
function formatDate(date: Date | number, format?: format) {
  const DATE = isNumber(date) ? new Date(date) : date
  const { t, g } = getFormat(format || ISO_DATE_FORMAT)

  let index = 0
  let item: IGroup

  // 正则规则的(\d{1,2}) 换成对应内容（再把保留字转回来）
  return t
    .replace(REG_NUM_REG, () => {
      item = g[index++]
      let value: string | number = ''

      // 根据规则获取值
      switch (item.k) {
        case Reserve.year:
          // 从末尾开始取指定位数
          value = (DATE.getFullYear() + '').substring(4 - item.l)
          break
        case Reserve.month:
          value = DATE.getMonth() + 1 // 0~11
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.day:
          value = DATE.getDate()
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.week:
          value = (item.l > 1 ? '星期' : '周') + WEEK[DATE.getDay()]
          break

        case Reserve.hour:
          value = DATE.getHours()
          value > 12 && (value -= 12)
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.Hour:
          value = DATE.getHours()
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.slot:
          value = DATE.getHours() > 12 ? '下' : '上'
          item.l > 1 && (value += '午')
          break
        case Reserve.minute:
          value = DATE.getMinutes()
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.second:
          value = DATE.getSeconds()
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.milliSecond:
          value = DATE.getMilliseconds() + ''
          switch (value.length) {
            case 1:
              value = '00' + value
              break
            case 2:
              value = '0' + value
              break
          }

          value = value.substring(3 - item.l)
          break
      }

      return value as string
    })
    .replace(REG_RESERVE, '$1')
}

const REG_WEEK = /(周|星期)[日一二三四五六]/g
const REG_NOON = /(上|下)午?/g
const REPLACE_WEEK = (match: string) => (match.length > 2 ? '00' : '0')
const REPLACE_NOON = (match: string, slot: string) =>
  (match.length > 1 ? '0' : '') + (slot === '上' ? '0' : '1')
/** 根据日期字符串得到Date对象
 * @test true
 *
 * @param {String} dateString 格式化的日期
 * @param {format} format 日期格式
 * @param {boolean} tryHistory 是否尝试历史记录
 *
 * @returns {Date} Date对象
 */
function getDate(
  dateString: string,
  format?: format | IResult,
  tryHistory?: boolean
): Date | undefined {
  const { r, g } =
    !format || isString(format) ? getFormat(format || ISO_DATE_FORMAT) : format
  tryHistory = tryHistory !== false

  let info: IObject<number> | undefined
  // 提取信息
  dateString
    // 先把星期几、上午/下午换成数字
    .replace(REG_WEEK, REPLACE_WEEK)
    .replace(REG_NOON, REPLACE_NOON)
    // 处理结果
    .replace(r, (...args) => {
      info || (info = {})

      const length = g.length

      let key: string
      let i = 0
      while (i < length) {
        key = g[i].k
        info[key] = Math.max(info[key] || 0, parseInt(args[i + 1]))

        i++
      }

      return args[0]
    })

  if (info) {
    // Date构造方法参数列表: 年月日时分秒毫秒，有undefined报Invalid Date，就不会忽略一下？
    const date = new Date()

    isNaN(info[Reserve.year]) || date.setFullYear(info[Reserve.year])
    // 0~11 ？？？
    isNaN(info[Reserve.month]) || date.setMonth(info[Reserve.month] - 1)
    isNaN(info[Reserve.day]) || date.setDate(info[Reserve.day])
    isNaN(info[Reserve.Hour])
      ? isNaN(info[Reserve.hour]) ||
        date.setHours((info[Reserve.slot] ? 12 : 0) + info[Reserve.hour])
      : date.setHours(info[Reserve.Hour])
    isNaN(info[Reserve.minute]) || date.setMinutes(info[Reserve.minute])
    isNaN(info[Reserve.second]) || date.setSeconds(info[Reserve.second])
    isNaN(info[Reserve.milliSecond]) ||
      date.setMilliseconds(info[Reserve.milliSecond])

    return date
  } else if (tryHistory) {
    // 从记录中尝试
    for (const item of CACHE.pool) {
      const result = getDate(dateString, item.v, false)
      if (result) {
        return result
      }
    }
  }
}

/** 获取本周起止日期
 * @test true
 *
 * @param {Date|string|number} date 指定日期对象/字符串
 * @param {format} format 日期格式
 * @param {boolean} toDate 是否截止到指定日期
 *
 * @returns {Array<String>} 格式化的日期数组
 */
function getWeek(
  date?: Date | string | number,
  format?: format,
  toDate?: boolean
) {
  format || (format = ISO_DATE_FORMAT)
  date = isNumber(date)
    ? new Date(date || 0)
    : isString(date)
      ? (date && getDate(date, format)) || new Date()
      : date || new Date()

  let target = new Date(date.getTime()) // 复制日期对象
  const result = []

  const week = target.getDay()
  const day = target.getDate()
  // 本周第一天
  target.setDate(day + 1 - week)
  result.push(formatDate(target, format))
  if (toDate) {
    target = date as Date
  } else {
    // 本周最后一天
    target.setDate(day + 7 - week)
  }
  result.push(formatDate(target, format))

  return result
}
/** 获取本月起止日期
 * @test true
 *
 * @param {Date|string} date 指定日期对象/字符串
 * @param {format} format 日期格式
 * @param {boolean} toDate 是否截止到指定日期
 *
 * @returns {Array<String>} 格式化的日期数组
 */
function getMonth(
  date?: Date | string | void,
  format?: format,
  toDate?: boolean
) {
  format || (format = ISO_DATE_FORMAT)
  date = isNumber(date)
    ? new Date(date || 0)
    : isString(date)
      ? (date && getDate(date, format)) || new Date()
      : date || new Date()

  let target = new Date((date as Date).getTime()) // 复制日期对象
  const result = []

  // 本月第一天 [一定是1号]
  target.setDate(1)
  result.push(formatDate(target, format))
  if (toDate) {
    target = date as Date
  } else {
    // 本月最后一天
    target.setDate(32) // 先到下个月
    target.setDate(0) // 上个月最后一天
  }
  result.push(formatDate(target, format))

  return result
}
/** 获取今年起止日期
 * @test true
 *
 * @param {Date|string} date 指定日期对象/字符串
 * @param {format} format 日期格式
 * @param {boolean} toDate 是否截止到指定日期
 *
 * @returns {Array<String>} 格式化的日期数组
 */
function getYear(
  date?: Date | string | void,
  format?: format,
  toDate?: boolean
) {
  format || (format = ISO_DATE_FORMAT)
  date = isNumber(date)
    ? new Date(date || 0)
    : isString(date)
      ? (date && getDate(date, format)) || new Date()
      : date || new Date()

  let target = new Date((date as Date).getTime()) // 复制日期对象
  const result = []

  // 今年第一天 [一定是1月1号]
  target.setDate(1)
  target.setMonth(0)
  result.push(formatDate(target, format))
  if (toDate) {
    target = date as Date
  } else {
    // 今年最后一天 [一定是12月31号]
    target.setDate(31)
    target.setMonth(11)
  }
  result.push(formatDate(target, format))

  return result
}

export { formatDate as default, getDate, getWeek, getMonth, getYear }
