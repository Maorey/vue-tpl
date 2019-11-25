/*
 * @Description: 日期格式化/反格式化
 * @Author: 毛瑞
 * @Date: 2019-06-27 12:58:37
 */
import { Memory } from '@/utils/storage'

/** 保留字枚举, 如下(允许使用转义字符\来输出保留字):
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
 *
 */
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
/** 保留字串
 */
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
/** 获取保留字最大重复次数
 * @param {Any} char 目标字符串
 *
 * @returns {Number}
 */
const getReserveMaxRepeat = (char: any) => {
  switch (char) {
    case Reserve.year:
      return 4
    case Reserve.milliSecond:
      return 3
    default:
      return 2
  }
}

/** 分组结果
 */
interface IGroup {
  /** 保留字
   */
  k: string
  /** 保留字重复次数
   */
  l: number
  /** 在原format字符串的索引
   */
  i?: number
}
/** 格式处理结果
 */
interface IResult {
  /** 正则表达式字符串
   */
  t: string
  /** 正则表达式
   */
  r: RegExp
  /** 分组
   */
  g: IGroup[]
}

/** 正则表达式保留字
 */
const RESERVE_REG = '`|{}[]()*?+.^$!'
/** 转义字符
 */
const ESCAPE = '\\'
/** 格式处理结果缓存
 */
const CACHE = new Memory()
/** 获取日期格式化对象，允许使用转义字符 \ 来输出保留字
 * @param {String} format 格式，保留字见Reserve枚举
 *
 * @returns {IResult} 格式处理结果
 */
function getFormat(format: string): IResult {
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
getFormat(ISO_DATE_FORMAT) // warm 下

const REG_NUM_REG = /\(\\d\{\d(,\d)?\}\)/g
const REG_RESERVE = new RegExp(
  `\\\\([${RESERVE_REG.replace(']', '\\]\\\\')}])`,
  'g',
)
/** 获得指定格式的日期字符串
 * @test true
 *
 * @param {Date} date 日期对象
 * @param {String} format 格式，保留字如下
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
 *
 * @returns {String} 格式化的日期字符串
 */
function formatDate(date: Date, format = ISO_DATE_FORMAT) {
  const { t, g } = getFormat(format)

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
          value = String(date.getFullYear()).substring(4 - item.l)
          break
        case Reserve.month:
          value = date.getMonth() + 1 // 0~11
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.day:
          value = date.getDate()
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.week:
          switch (date.getDay()) {
            case 0:
              value = '日'
              break
            case 1:
              value = '一'
              break
            case 2:
              value = '二'
              break
            case 3:
              value = '三'
              break
            case 4:
              value = '四'
              break
            case 5:
              value = '五'
              break
            case 6:
              value = '六'
              break
          }
          value = (item.l > 1 ? '星期' : '周') + value
          break

        case Reserve.hour:
          value = date.getHours()
          value > 12 && (value -= 12)
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.Hour:
          value = date.getHours()
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.slot:
          value = date.getHours() > 12 ? '下' : '上'
          item.l > 1 && (value += '午')
          break
        case Reserve.minute:
          value = date.getMinutes()
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.second:
          value = date.getSeconds()
          item.l > 1 && value < 10 && (value = '0' + value)
          break
        case Reserve.milliSecond:
          value = String(date.getMilliseconds())
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

const REG_WEEK = /(周|星期)[一二三四五六日]/g
const REG_NOON = /(上|下)午?/g
const REPLACE_WEEK = (match: string) => (match.length > 2 ? '00' : '0')
const REPLACE_NOON = (match: string, slot: string) =>
  (match.length > 1 ? '0' : '') + (slot === '上' ? '0' : '1')
/** 根据日期字符串得到Date对象
 * @test true
 *
 * @param {String} dateString 日期字符串
 * @param {String} format 格式，保留字如下
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
 *
 * @returns {Date} Date对象
 */
function getDateByString(
  dateString: string,
  format: string | IResult = ISO_DATE_FORMAT,
  tryHistory = true,
): Date | void {
  const { r, g } = typeof format === 'string' ? getFormat(format) : format

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
      const result = getDateByString(dateString, item.v, false)
      if (result) {
        return result
      }
    }
  }
}

export { formatDate as default, getDateByString }
