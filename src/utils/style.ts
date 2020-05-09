/*
 * @Description: css样式处理
 * @Author: 毛瑞
 * @Date: 2019-07-02 16:50:15
 */
import { isString, isFn } from '.'
import { camelToKebab } from './case'

const PREV_STRING = ';\\s*'
const TAIL_STRING = '\\s*:\\s*(.*?)\\s*;'
/** 获取样式字符串指定key的值
 * @param {String} style 样式字符串
 * @param {String} name 样式名
 *
 * @returns {String}
 */
function getValue(style: string, name: string) {
  const result = new RegExp(PREV_STRING + name + TAIL_STRING).exec(style)

  return result ? result[1] : ''
}

/** 获取指定属性的样式
 * @test true
 *
 * @param {String | IObject<string>} style 样式字符串
 * @param {String} name 样式名
 *
 * @returns {String}
 */
function getStyleByName(style: string | IObject<string>, name: string) {
  if (style && name) {
    const kebabName = camelToKebab(name)

    if (isString(style)) {
      style = `;${style};` // 补分号先
      return getValue(style, name) || getValue(style, kebabName)
    }

    return style[name] || style[kebabName] || ''
  }

  return ''
}

/** 提取样式正则 分组：key,value */
const REG_STYLE = / *(.*?) *: *(.*?) *;/g
/** 双引号 */
const REG_QUOT = /"+/g
/** 末尾逗号 */
const REG_COMMA = /,*$/
/** css样式字符串转为对象/JSON
 *  (不处理key 'margin-top: 2px' -> {'margin-top': '2px'})
 * @test true
 *
 * @param {String} style 样式字符串
 * @param {Function | Boolean} filter Function: 过滤函数 Boolean: isjson
 *  返回[string, string]: 依次修改样式名和样式值
 *  返回string: 修改样式值
 *  返回true: 跳过改样式
 *  返回false|void: 不做修改
 * @param {Boolean} isjson 是否返回json
 *
 * @returns {Object|JSON}
 */
function styleToObject(
  style: string | IObject<string>,
  filter?:
    | ((
        key: string,
        value: string,
        match?: string
      ) => [string, string] | string | boolean | void)
    | boolean,
  isjson?: boolean
): IObject<string> | string {
  if (isString(style)) {
    style = style.trim()

    if (!style) {
      return isjson ? '{}' : {} // 空字符串
    }
  } else {
    return style // 对象直接返回
  }
  // 筛选方法
  if (!isFn(filter)) {
    isjson = filter
    filter = false
  }

  style += ';' // 先补个分号
  // ===[0-9a-z_-] 因为有使用颜色数组所以可能出现样式 0:#fff;1:#000;
  // 允许任意字符吧... 颜色二维数组数的时候会用个@... 0@0:#fff;0@1:#fff;1@0:#fff;1@1:#fff;
  // const reg = / *(.*?) *: *(.*?) *;/g // 提取样式正则 分组：key,value

  // 双引号处理
  // fontFamily:"Microsoft Yahei", arial, sans-serif, "Microsoft Yahei" 1
  // ""Microsoft Yahei", arial, sans-serif, "Microsoft Yahei"" 2
  // "arial, sans-serif" 3
  // "arial, "Microsoft Yahei", sans-serif" 4
  // ...
  // const trim = /^"(?=")|"(?!")$/g // 不对
  // /^"{1}|"{1}$/g // 不对 /^"(.*?")"$/g // 咋都不对
  // 不处理了mmp （可以用方法）
  // const quot = /"+/g // 转义双引号

  /// RegExp.exec【更快】 ///
  let json = '{'
  let temp: [string, string] | string | boolean | void
  let result: string[] | null
  // 不这么写不能得到下一次匹配...
  while ((result = REG_STYLE.exec(style))) {
    if (filter) {
      temp = filter(result[1], result[2], result[0])
      if (temp) {
        if (temp === true) {
          continue
        } else if (isString(temp)) {
          result[2] = temp
        } else {
          result[1] = temp[0]
          result[2] = temp[1]
        }
      }
    }

    // 首尾双引号直接去掉
    json += `"${result[1]}":"${result[2].replace(REG_QUOT, '\\"')}",`
  }
  json = json.replace(REG_COMMA, '}') // 去末尾,加}

  /// replace ///
  // const json =
  //   '{' +
  //   style
  //     .replace(reg, function(match, $1, $2) {
  //       let result = arguments
  //       // 去掉首尾双引号、保留中间双引号
  //       return result.length > 2
  //         ? `"${result[1]}":"${result[2].replace(quot, '\\"')}",`
  //         : ''
  //     }) // '"$1":"$2",') // 格式键值对
  //     .replace(/[ ,;]*$/, '}') // 去末尾 ,;加}

  return isjson ? json : JSON.parse(json)
}

/** 值没有单位的样式 */
const NO_UNIT = ['z-index']
/** 样式对象还原为css样式（值为数字的默认单位px）
 * @test true
 *
 * @param {IObject<string>} styleObj 样式对象
 * @param {Function} filter 过滤函数
 *  返回[string, string]: 依次修改样式名和样式值
 *  返回string: 修改样式值
 *  返回true: 跳过改样式
 *  返回false|void: 不做修改
 *
 * @returns {string} 样式字符串
 */
function objectToStyle(
  styleObj: IObject<string> | string,
  filter?: (
    key: string,
    value: string,
    styleObject?: IObject<string>
  ) => [string, string] | string | boolean | void
) {
  if (isString(styleObj)) {
    return styleObj // 原样返回
  }

  // return styleObj
  //   ? JSON.stringify(styleObj).replace(
  // 真难写【呃，fontFamily: '"Microsoft Yahei", arial,
  //  sans-serif, "Microsoft Yahei"'有问题】
  //       /{?"(.*?)":"?(.*?)("(?=,|}))?[,}]/g,
  //       // Number('') === Number(' ') === 0
  //       // 纯数字（除0）加上px单位
  //       (match, $1, $2) =>
  //         dealKey($1) + ':' + $2 + (Number($2) ? 'px;' : ';')
  //     )
  //   : ''
  // return styleObj
  //   ? JSON.stringify(styleObj, function(key, val) {
  //       // key 不能处理
  //       if (key) {
  //         // Number('') === Number(' ') === 0
  //         val = '^' + val + (key !== 'z-index' && Number(val) ? 'px^' : '^')
  //       }

  //       return val
  //     }).replace(/{?"(.*?)":"\^(.*?)\^"[,}]/g,'$1:$2;')
  //   : ''

  /// 结果字符串短的时候，还是字符串拼接最快 ///
  let css = ''
  let value: string
  let temp: [string, string] | string | boolean | void
  for (let key in styleObj) {
    value = styleObj[key]
    key = camelToKebab(key)

    if (filter) {
      temp = filter(key, value, styleObj)
      if (temp) {
        if (temp === true) {
          continue
        } else if (isString(temp)) {
          value = temp
        } else {
          key = temp[0]
          value = temp[1]
        }
      }
    }

    // Number('') === Number(' ') === 0
    // 纯数字（除0）加上px单位
    Number(value) && !NO_UNIT.includes(key) && (value += 'px')

    css += `${key}:${value};`
  }

  return css
}

/** 更新样式字符串
 * @test true
 *
 * @param {String|Object} current 当前样式
 * @param {String|Object} target 带更新样式
 * @param {Function} filter 过滤函数
 *  返回[string, string]: 依次修改样式名和样式值
 *  返回string: 修改样式值
 *  返回true: 跳过改样式
 *  返回false|void: 不做修改
 *
 * @returns {String} 更新后的样式
 */
function updateStyle(
  current: string | IObject<string>,
  target: string | IObject<string>,
  filter?: (
    key: string,
    value: string,
    current?: IObject<string>,
    target?: IObject<string>
  ) => [string, string] | string | boolean | void
) {
  if (!current) {
    // 当前为空
    return objectToStyle(target, filter) || ''
  } else if (target) {
    current = styleToObject(current) as IObject<string>
    target = styleToObject(target) as IObject<string>

    let value: string
    let temp: [string, string] | string | boolean | void
    for (let key in target) {
      value = target[key]

      if (filter) {
        temp = filter(key, value, current, target)
        if (temp) {
          if (temp === true) {
            continue
          }

          if (isString(temp)) {
            value = temp
          } else {
            key = temp[0]
            value = temp[1]
          }
        }
      }

      if (value) {
        current[key] = value
      } else {
        delete current[key]
      }
    }
  }

  return objectToStyle(current) || ''
}

export { getStyleByName, styleToObject, objectToStyle, updateStyle }
