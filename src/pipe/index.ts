import { hasOwn, isBool, isString, isObj, isFn } from '@/utils'

/** 过滤器 (返回{k,v}对象以替换, 非对象真值表示匹配) */
type Handler<T = any> = (
  filteredValue: any,
  key: string,
  object: T
) => Falsy | true | 1 | { /** 键 */ k?: string; /** 值 */ v: any }
/** 过滤器字典 除过滤规则外, 真值表示匹配 */
type Records<T = any> = { [key: string]: Falsy | true | 1 | Rule<T> }
/** 过滤规则, 应用匹配的规则 */
export type Rule<T = any> =
  | RegExp
  | Handler<T>
  | Records<T>
  | (string | RegExp | Records<T>)[]
/** 模式 白名单/黑名单 */
export type Mode = 'white' | 'black'

function matchRule<T = any>(
  rules: Rule<T>,
  key: string,
  isWhile: boolean
): boolean | Handler<T> | Records<T> {
  let rule
  switch (true) {
    case isFn(rules):
      return rules as Handler<T>
    case isFn(((rules as RegExp) || 0).test):
      return (rules as RegExp).test(key) ? isWhile : !isWhile
    case Array.isArray(rules):
      for (rule of rules as (string | RegExp | Records<T>)[]) {
        if (rule === key) {
          return isWhile
        } else if (rule && isObj(rule)) {
          if (isFn((rule as RegExp).test)) {
            if ((rules as RegExp).test(key)) {
              return isWhile
            }
          } else if (hasOwn(rule, key)) {
            return matchRule(rule, key, isWhile)
          }
        }
      }
      return !isWhile
    default:
      rule = ((rules as Records<T>) || 0)[key]
      return rule
        ? isFn(rule) || isObj(rule)
          ? (rule as Handler<T> | Records<T>)
          : isWhile
        : !isWhile
  }
}
/** 去掉falsy属性/空对象/空数组拷贝
 * @param object 目标对象/数组
 * @param deep 是否深拷贝
 */
function trim<T extends object>(object: T, deep?: boolean): T
/** 去掉falsy属性/空对象/空数组拷贝
 * @param object 目标对象/数组
 * @param rules 自定义规则
 * @param deep 是否深拷贝
 * @param mode 模式 白名单(默认)/黑名单
 */
function trim<T extends object>(
  object: T,
  rules: Rule<T>,
  deep?: boolean,
  mode?: Mode
): T
/** 去掉falsy属性/空对象/空数组拷贝
 * @param object 目标对象/数组
 * @param rules 自定义规则
 * @param mode 模式 白名单(默认)/黑名单
 * @param deep 是否深拷贝
 */
function trim<T extends object>(
  object: T,
  rules: Rule<T>,
  mode?: Mode,
  deep?: boolean
): T
function trim(object: any, rules?: any, mode?: any, deep?: any) {
  if (!object) {
    return object
  }

  let temp
  if (isBool(rules)) {
    deep = rules
    rules = mode = null
  } else if (isBool(mode) || isString(deep)) {
    temp = deep
    deep = mode
    mode = temp
    temp = 0
  }

  const isWhile = mode !== 'black'
  const isArray = Array.isArray(object)
  const result: any = isArray ? [] : {}
  let key
  let value
  for (key in object) {
    value = object[key]
    if (isArray || !rules ? value : (temp = matchRule(rules, key, isWhile))) {
      deep &&
        value &&
        isObj(value) &&
        (value = trim(value, isObj(temp) ? temp : rules, mode, deep))

      if (temp) {
        if (isFn(temp)) {
          if ((temp = temp(value, key, object))) {
            if (isObj(temp)) {
              result[isString(temp.k) ? temp.k : key] = temp.v
            } else if (isWhile) {
              result[key] = value
            }
          }
        } else {
          result[key] = value
        }
        temp = 0
      } else if (value && isObj(value)) {
        for (temp in value) {
          isArray ? result.push(value) : (result[key] = value)
          temp = 0
          break
        }
      } else {
        isArray ? result.push(value) : (result[key] = value)
      }
    }
  }
  return result
}

export { trim }
