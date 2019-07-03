/*
 * @Description: 日期格式化/反格式化
 * @Author: 毛瑞
 * @Date: 2019-06-27 12:58:37
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-03 17:12:07
 */
import { Memory } from '@/utils/storage'
import { IObject } from '@/types'

/** 保留字枚举, 规则如下:
 * y: 一到四位，表示年 比如 yyyy=2018 yyy=018 yy=18 y=8
 * M: 一到二位，表示月 MM: 始终两位数字 比如7月 => 07 (MM) 7 (M)
 * d: 一到二位，表示日
 * w：一到二位，表示周，比如 w=周四 ww=星期四
 *
 * h：一到二位，表示12小时制的小时
 * H：一到二位，表示24小时制的小时
 * t：一到二位，表示上午或下午 t=下 tt=下午
 * m：一到二位，表示分钟
 * s：一到二位，表示秒钟
 * n: 一到三位，表示毫秒数
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

// 获取保留字正则
const getRegReserve = (reserve: string, length: number = 3): RegExp =>
  new RegExp(`\\\\?(${reserve}{1,${length}})`, 'g')
// 匹配前面没有\的保留字 就多加一位吧...
const REG_RESERVE: IObject<RegExp> = {
  // 年月日星期
  [Reserve.year]: getRegReserve(Reserve.year, 5),
  [Reserve.month]: getRegReserve(Reserve.month),
  [Reserve.day]: getRegReserve(Reserve.day),
  [Reserve.week]: getRegReserve(Reserve.week),

  // 时分秒毫秒
  [Reserve.hour]: getRegReserve(Reserve.hour),
  [Reserve.Hour]: getRegReserve(Reserve.Hour),
  [Reserve.slot]: getRegReserve(Reserve.slot),
  [Reserve.minute]: getRegReserve(Reserve.minute),
  [Reserve.second]: getRegReserve(Reserve.second),
  [Reserve.milliSecond]: getRegReserve(Reserve.milliSecond, 4),
}

/** 保留字处理结果
 */
interface IReg {
  /** 保留字
   */
  word: string
  /** 标识
   */
  flag: boolean
  /** 长度
   */
  len: number
  /** 索引
   */
  idx: number
}
/** 分组结果
 */
interface IGroup {
  /** 格式键 见REG对象
   */
  key: string
  /** 长度
   */
  len: number
  /** 在原format字符串的索引
   */
  idx: number
}
/** 格式处理结果
 */
interface IResult {
  /** 正则表达式字符串
   */
  tpl: string
  /** 正则表达式
   */
  reg: RegExp
  /** 分组
   */
  group: IGroup[]
}

/** 处理保留字等
 * @param {String} key 规则名
 * @param {Array} arr 参数列表
 */
function handleReserve(
  key: string,
  match: string,
  word: string,
  index: number
): IReg | void {
  let len: number = word.length
  let flag: boolean = false

  word = ''
  if (match.length - len) {
    // \开头的
    if (len === 1) {
      return
    } else {
      word = match.substring(0, 2)
      index += 2 // 跳过俩字符
      len--
    }
  } else {
    // 非 \ 开头多一个字符的
    switch (key) {
      case Reserve.year:
        if (len === 5) {
          flag = true
          len--
        }
        break
      case Reserve.milliSecond:
        if (len === 4) {
          flag = true
          len--
        }
        break
      default:
        if (len === 3) {
          flag = true
          len--
        }
    }
  }

  return { word, flag, len, idx: index }
}
/** 按idx属性升序将对象插入数组
 * @param {Array<IGroup>} group 目标数组
 * @param {IGroup} item 待插入值
 */
function insert(group: IGroup[], item: IGroup): void {
  const length: number = group.length

  if (length) {
    let tmp: IGroup
    let i: number = 0
    while (i < length) {
      tmp = group[i]
      if (tmp.idx > item.idx) {
        group.splice(i, 0, item)
        return
      }
      i++
    }
  }

  group.push(item)
}

// 正则表达式保留字(保留转义字符\用来转义保留字)
const REG_WORD: RegExp = /([`|{}[\]()*?+.^$!])/g
const CACHE = new Memory() // 最多缓存30条, 永不过期

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

  // format转正则表达式 (先转义正则的保留字)
  let regString: string = format.replace(REG_WORD, '\\$1')

  const group: IGroup[] = []

  let key: string
  let tmp: IReg | void
  for (key in REG_RESERVE) {
    // 确定顺序
    format.replace(
      REG_RESERVE[key],
      (match: string, word: string, index: number): string => {
        tmp = handleReserve(key, match, word, index)
        if (tmp) {
          // 插入排序
          insert(group, { key, len: tmp.len, idx: tmp.idx })
          tmp.flag && insert(group, { key, len: 1, idx: tmp.idx + tmp.len })
        }

        return match
      }
    )
    // 获得正则表达式
    regString = regString.replace(
      REG_RESERVE[key],
      (match: string, word: string, index: number): string => {
        tmp = handleReserve(key, match, word, index)
        if (!tmp) {
          return match
        }

        let len: string | number = tmp.len
        let tail: string = tmp.flag ? '(\\d{' : ''
        let tailLen: string = '1'

        switch (key) {
          case Reserve.month:
          case Reserve.day:
          case Reserve.hour:
          case Reserve.Hour:
          case Reserve.minute:
          case Reserve.second:
            if (len === 1) {
              len = len + ',2'
            }
            if (tmp.flag) {
              tailLen += ',2'
            }
            break
        }

        if (tmp.flag) {
          tail += tailLen + '})'
        }

        return tmp.word + '(\\d{' + len + '})' + tail
      }
    )
  }

  return CACHE.set(format, {
    tpl: regString,
    reg: new RegExp('^' + regString + '$'),
    group,
  })
}

const ISO_DATE_FORMAT: string = 'yyyy-MM-ddTHH:mm:ss.nnnZ'
const REG_WEEK = /(周|星期)[一二三四五六日]/g
const REG_NOON = /(上|下)午?/g
const REPLACE_WEEK = (match: string) => (match.length > 2 ? '00' : '0')
const REPLACE_NOON = (match: string, slot: string) =>
  (match.length > 1 ? '0' : '') + (slot === '上' ? '0' : '1')
/** 根据日期字符串得到Date对象
 * @param {String} dateString 日期字符串
 * @param {String} format 格式，保留字如下
 * y: 一到四位，表示年 比如 yyyy=2018 yyy=018 yy=18 y=8
 * M: 一到二位，表示月 MM: 始终两位数字 比如7月 => 07 (MM) 7 (M)
 * d: 一到二位，表示日
 * w：一到二位，表示周，比如 w=周四 ww=星期四
 *
 * h：一到二位，表示12小时制的小时
 * H：一到二位，表示24小时制的小时
 * t：一到二位，表示上午或下午 t=下 tt=下午
 * m：一到二位，表示分钟
 * s：一到二位，表示秒钟
 * n: 一到三位，表示毫秒数
 *
 * @returns {Date} Date对象
 */
function getDateByString(
  dateString: string,
  format: string = ISO_DATE_FORMAT
): Date {
  const { reg, group } = getFormat(format)
  const info: IObject<number> = {}

  dateString
    // 先把星期几、上午、下午换成数字
    .replace(REG_WEEK, REPLACE_WEEK)
    .replace(REG_NOON, REPLACE_NOON)
    // 处理结果
    .replace(reg, (...args) => {
      const length: number = group.length

      let key: string
      let i: number = 0
      while (i < length) {
        key = group[i].key
        info[key] = Math.max(info[key] || 0, parseInt(args[i + 1]))

        i++
      }

      return args[0]
    })

  // Date构造方法参数列表：年月日时分秒毫秒
  // 智障啊，传undefined报Invalid Date，就不会忽略一下？
  const date = new Date()

  info[Reserve.year] && date.setFullYear(info[Reserve.year])
  info[Reserve.month] && date.setMonth(info[Reserve.month] - 1) // 0~11 ？？？
  info[Reserve.day] && date.setDate(info[Reserve.day])
  info[Reserve.Hour]
    ? date.setHours(info[Reserve.Hour])
    : info[Reserve.hour] &&
      date.setHours((info[Reserve.slot] ? 12 : 0) + info[Reserve.hour])
  info[Reserve.minute] && date.setMinutes(info[Reserve.minute])
  info[Reserve.second] && date.setSeconds(info[Reserve.second])
  info[Reserve.milliSecond] && date.setMilliseconds(info[Reserve.milliSecond])

  return date
}

const REG_NUM = /\(\\d\{\d(,\d)?\}\)/g
const REG_DE_WORD = new RegExp(`\\\\(${REG_WORD.source})`, 'g')
/** 获得指定格式的日期字符串
 * @param {Date} date 日期对象
 * @param {String} format 格式，保留字如下
 * y: 一到四位，表示年 比如 yyyy=2018 yyy=018 yy=18 y=8
 * M: 一到二位，表示月 MM: 始终两位数字 比如7月 => 07 (MM) 7 (M)
 * d: 一到二位，表示日
 * w：一到二位，表示周，比如 w=周四 ww=星期四
 *
 * h：一到二位，表示12小时制的小时
 * H：一到二位，表示24小时制的小时
 * t：一到二位，表示上午或下午 t=下 tt=下午
 * m：一到二位，表示分钟
 * s：一到二位，表示秒钟
 * n: 一到三位，表示毫秒数
 *
 * @returns {String} 格式化的日期字符串
 */
function formatDate(date: Date, format: string = ISO_DATE_FORMAT): string {
  // 默认返回ISO格式
  const formatResult: IResult = getFormat(format)

  let index: number = 0
  let item: IGroup

  // 正则规则的(\d{1,2}) 换成对应内容（再把保留字转回来）
  return formatResult.tpl
    .replace(REG_NUM, () => {
      item = formatResult.group[index++]
      let value: string | number = ''

      // 根据规则获取值
      switch (item.key) {
        case Reserve.year:
          // 从末尾开始取指定位数
          value = String(date.getFullYear()).substring(4 - item.len)
          break
        case Reserve.month:
          value = date.getMonth() + 1 // 0~11
          if (item.len === 2 && value < 10) {
            value = '0' + value
          }
          break
        case Reserve.day:
          value = date.getDate()
          if (item.len === 2 && value < 10) {
            value = '0' + value
          }
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
          value = (item.len === 2 ? '星期' : '周') + value
          break

        case Reserve.hour:
          value = date.getHours()
          if (value > 12) {
            value -= 12
          }

          if (item.len === 2 && value < 10) {
            value = '0' + value
          }
          break
        case Reserve.Hour:
          value = date.getHours()
          if (item.len === 2 && value < 10) {
            value = '0' + value
          }
          break
        case Reserve.slot:
          value = date.getHours() > 12 ? '下' : '上'
          if (item.len === 2) {
            value += '午'
          }
          break
        case Reserve.minute:
          value = date.getMinutes()
          if (item.len === 2 && value < 10) {
            value = '0' + value
          }
          break
        case Reserve.second:
          value = date.getSeconds()
          if (item.len === 2 && value < 10) {
            value = '0' + value
          }
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

          value = value.substring(3 - item.len)
          break
      }

      return String(value)
    })
    .replace(REG_DE_WORD, '$1')
}

export { formatDate as default, getDateByString }
