/*
 * @Description: 日期格式化/反格式化
 * @Author: 毛瑞
 * @Date: 2019-06-27 12:58:37
 * @LastEditors: Maorey
 * @LastEditTime: 2019-07-02 22:49:34
 */
import { IObject } from '@/types'

// const enum Reserve {
//   // 年月日星期
//   year,
//   month,
//   day,
//   week,

//   // 时分秒毫秒
//   hour,
//   Hour,
//   slot,
//   minute,
//   second,
//   milliSec,
// }

/** 保留字处理结果
 */
interface IReg {
  /** 保留字
   */
  reserve: string
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

/** 处理保留字等
 * @param {String} key 规则名
 * @param {Array} arr 参数列表
 */
function handleReserve(key: string, match: string, reserve: string, index: number): IReg | string {
  let len: number = reserve.length
  let flag: boolean = false

  reserve = ''
  if (match.length - len) { // \开头的
    if (len === 1) {
      return match
    } else {
      index += 2 // 跳过俩字符
      len--
      reserve = match.substring(0, 2)
    }
  } else { // 非 \ 开头多一个字符的
    switch (key) {
      case 'year':
        if (len === 5) {
          flag = true
          len--
        }
        break
      case 'milliSec':
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

  return { reserve, flag, len, idx: index }
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
        break
      }
      i++
    }
  } else {
    group.push(item)
  }
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

// 匹配前面没有\的保留字 就多加一位吧...
const REG: IObject<RegExp> = {
  // 年月日星期
  year: /\\?(y{1,5})/g, // 1到4位
  month: /\\?(M{1,3})/g, // 1到2位
  day: /\\?(d{1,3})/g, // 1到2位 避免与正则 \d 冲突
  week: /\\?(w{1,3})/g, // 1到2位

  // 时分秒毫秒
  hour: /\\?(h{1,3})/g, // 1到2位 12小时
  Hour: /\\?(H{1,3})/g, // 1到2位 24小时
  slot: /\\?(t{1,3})/g, // 1到2位 上午或下午
  minute: /\\?(m{1,3})/g, // 1到2位
  second: /\\?(s{1,3})/g, // 1到2位
  milliSec: /\\?(n{1,4})/g, // 1到3位
}
const REG_RESERVE: RegExp = /([`|||{|}|[|\]|(|)|*|?|+|.|^|$|!])/g // 保留字

/** 获取日期格式化对象，允许使用转义字符 \ 来输出保留字
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
 * @returns {Object}
 */
function getFormat(format: string): IResult {
  // format转正则表达式
  // (先转义正则的保留字，一定要加分组，不然$1取不到，转义字符\不需要也不能转义)
  let regString: string = format.replace(REG_RESERVE, '\\$1')

  const group: IGroup[] = []

  let key: string
  let tmp: IReg | string
  for (key in REG) {
    // 没办法只好多来一次专门用来确定顺序 效率也不差这点
    format.replace(REG[key], (match: string, reserve: string, index: number): string => {
      tmp = handleReserve(key, match, reserve, index)
      if (typeof tmp === 'string') {
        return tmp
      }

      // 插入排序
      insert(group, { key, len: tmp.len, idx: tmp.idx })
      tmp.flag && insert(group, { key, len: 1, idx: tmp.idx + tmp.len })

      return ''
    })
    // 获得正则表达式
    regString = regString.replace(REG[key], (match: string, reserve: string, index: number): string => {
      tmp = handleReserve(key, match, reserve, index)
      if (typeof tmp === 'string') {
        return tmp
      }

      let len: string | number = tmp.len
      let tail: string = tmp.flag ? '(\\d{' : ''
      let tailLen: string = '1'

      switch (key) {
        case 'month':
        case 'day':
        case 'hour':
        case 'Hour':
        case 'minute':
        case 'second':
          if (len === 1) {
            len = len + ',2'
          }
          if (tmp.flag) {
            tailLen += ',2'
          }
          break
      }

      tmp.flag && (tail += tailLen + '})')

      return tmp.reserve + '(\\d{' + len + '})' + tail
    })
  }

  return { tpl: regString, reg: new RegExp('^' + regString + '$'), group }
}

const ISO_DATE_FORMAT: string = 'yyyy-MM-ddTHH:mm:ss.nnnZ'
const REG_WEEK = /(周|星期)[一|二|三|四|五|六]/g
const REG_NOON = /[上|下]午?/g
const REPLACE_WEEK = (match: string) => match.length > 2 ? '00' : '0'
const REPLACE_NOON = (match: string) => match.length > 1 ? '00' : '0'
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
function getDateByString(dateString: string, format: string = ISO_DATE_FORMAT): Date {
  const { reg, group } = getFormat(format)
  const info: IObject<number> = { length: 0 }

  // 先把星期几、上午、下午换成数字(在上面的正则里写看起来没毛病，但不造为何会匹配失败...)
  dateString.replace(REG_WEEK, REPLACE_WEEK).replace(REG_NOON, REPLACE_NOON).replace(reg, (...args) => {
    const length: number = group.length

    let num: number
    let key: string
    let i: number = 0
    while (i < length) {
      num = parseInt(args[i + 1])
      key = group[i].key
      if (info[key] === undefined) {
        info[key] = num
        info.length++
      } else {
        info[key] = Math.max(info[key], num)
      }

      i++
    }

    return ''
  })

  // Date构造方法参数列表：年月日时分秒毫秒
  // 智障啊，传undefined报Invalid Date，就不会忽略一下？
  const date = new Date()

  info.year && date.setFullYear(info.year)
  info.month && date.setMonth(info.month - 1) // 0~11 ？？？
  info.day && date.setDate(info.day);

  (info.hour24 || info.hour12) && date.setHours(info.hour24 || info.hour12)
  info.minute && date.setMinutes(info.minute)
  info.second && date.setSeconds(info.second)
  info.milliSec && date.setMilliseconds(info.milliSec)

  return date
}

const REG_NUM = /\(\\d\{\d(,\d)?\}\)/g
/** 获得指定格式的日期字符串
   * @param {Date} date 日期对象
   * @param {String} format 格式
   *
   * @returns {String} 格式化的日期字符串
   */
function formatDate(date: Date, format: string = ISO_DATE_FORMAT): string {
  // 默认返回ISO格式
  const formatResult: IResult = getFormat(format)

  let index: number = 0
  let item: IGroup

  // 正则规则的(\d{1,2}) 换成对应内容（再把保留字转回来）
  return formatResult.tpl.replace(REG_NUM, () => {
    item = formatResult.group[index++]
    let value: string | number = ''
    let prefix: string

    // 根据规则获取值
    switch (item.key) {
      case 'year':
        // 从末尾开始取指定位数
        value = String(date.getFullYear()).substring(4 - item.len)
        break
      case 'month':
        value = date.getMonth() + 1 // 0~11
        if (item.len === 2 && value < 10) {
          value = '0' + value
        }
        break
      case 'day':
        value = date.getDate()
        if (item.len === 2 && value < 10) {
          value = '0' + value
        }
        break
      case 'week':
        value = date.getDay()
        prefix = item.len === 2 ? '星期' : '周'

        switch (value) {
          case 0:
            value = prefix + '日'
            break
          case 1:
            value = prefix + '一'
            break
          case 2:
            value = prefix + '二'
            break
          case 3:
            value = prefix + '三'
            break
          case 4:
            value = prefix + '四'
            break
          case 5:
            value = prefix + '五'
            break
          case 6:
            value = prefix + '六'
            break
        }
        break

      case 'hour':
        value = date.getHours()
        if (value > 12) {
          value -= 12
        }

        if (item.len === 2 && value < 10) {
          value = '0' + value
        }
        break
      case 'Hour':
        value = date.getHours()
        if (item.len === 2 && value < 10) {
          value = '0' + value
        }
        break
      case 'slot':
        value = date.getHours() > 12 ? '下' : '上'
        if (item.len === 2) {
          value += '午'
        }
        break
      case 'minute':
        value = date.getMinutes()
        if (item.len === 2 && value < 10) {
          value = '0' + value
        }
        break
      case 'second':
        value = date.getSeconds()
        if (item.len === 2 && value < 10) {
          value = '0' + value
        }
        break
      case 'milliSec':
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
  }).replace(/\\(\w)/g, '$1')
}

export { formatDate, getDateByString }
