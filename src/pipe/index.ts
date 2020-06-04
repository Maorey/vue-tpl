import { isObj, isFn, isBool, isString } from '@/utils'

interface Handler<T = any> {
  /** filter: 返回对象更新key:value, 否则略过该属性 */
  [key: string]:
    | 1
    | true
    | ((
        filteredValue: any,
        obj: T
      ) => {
        /** 键 */
        k?: string
        /** 值 */
        v: any
      } | void)
    | Rule<T>
}
/** 过滤规则 */
export type Rule<T = any> = (string | Handler<T>)[] | Handler<T>
/** 模式 白名单/黑名单 */
export type Mode = 'white' | 'black'

function matchRule<T = any>(rules: Rule<T>, key: string, mode?: Mode) {
  const isWhile = mode !== 'black'
  let rule
  if (Array.isArray(rules)) {
    for (rule of rules) {
      if (isObj(rule)) {
        if ((rule = rule[key])) {
          return isWhile ? rule : isFn(rule) && rule
        }
      } else if (rule === key) {
        return isWhile
      }
    }
  } else if ((rule = rules[key])) {
    return isWhile ? rule : isFn(rule) && rule
  }
  return !isWhile
}
/** 去掉falsy属性/空对象/空数组拷贝
 * @param obj 目标对象/数组
 * @param deep 是否深拷贝
 */
function trim<T extends object>(obj: T, deep?: boolean): T
/** 去掉falsy属性/空对象/空数组拷贝
 * @param obj 目标对象/数组
 * @param rules 自定义规则
 * @param deep 是否深拷贝
 * @param mode 模式 白名单(默认)/黑名单
 */
function trim<T extends object>(
  obj: T,
  rules: Rule<T>,
  deep?: boolean,
  mode?: Mode
): T
/** 去掉falsy属性/空对象/空数组拷贝
 * @param obj 目标对象/数组
 * @param rules 自定义规则
 * @param mode 模式 白名单(默认)/黑名单
 * @param deep 是否深拷贝
 */
function trim<T extends object>(
  obj: T,
  rules: Rule<T>,
  mode?: Mode,
  deep?: boolean
): T
function trim(obj: any, rules?: any, mode?: any, deep?: any) {
  if (!obj) {
    return obj
  }

  let temp
  if (isObj(rules)) {
    if (isBool(mode) || isString(deep)) {
      temp = deep
      deep = mode
      mode = temp
      temp = 0
    }
    // mode || (mode = 'white')
  } else {
    deep = rules
    rules = mode = null
  }

  const isArray = Array.isArray(obj)
  const result: any = isArray ? [] : {}
  let key
  let value
  let isDeeped
  for (key in obj) {
    value = obj[key]
    if (isArray || !rules ? value : (temp = matchRule(rules, key, mode))) {
      isDeeped = deep && value && isObj(value)
      isDeeped && (value = trim(value, isObj(temp) ? temp : rules, mode, deep))
      if (isFn(temp)) {
        if ((temp = temp(value, obj))) {
          result[isString(temp.k) ? temp.k : key] = temp.v
          temp = 0
        }
      } else if (isDeeped && !temp) {
        for (temp in value) {
          result[key] = value
          temp = 0
          break
        }
      } else {
        result[key] = value
      }
    }
  }
  return result
}

export { trim }
