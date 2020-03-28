/*
 * @Description: 深克隆/扩展 对象/数组(不考虑原型和循环引用)
 * @Author: 毛瑞
 * @Date: 2019-06-27 12:58:37
 */
import { hasOwnProperty, isObj, isArray, isFn } from '@/utils'

/** 自定义过滤函数
 * @param {String} key 待拷贝属性
 * @param {Any} targetValue 目标值
 * @param {Any} currentValue 当前值
 * @param {Object|Array} currentObject 当前对象
 * @param {Object|Array} targetObject 目标对象
 * @param {Number} deep 递归层级
 *
 * @returns {any} 若返回真值: 含value属性则设置值为value, 否则跳过设置值
 */
export type Filter = (
  key: string,
  targetValue: any,
  currentValue: any,
  currentObject: any,
  targetObject: any,
  deep?: number
) => any

/** 深扩展一个对象/数组
 * @param {Object|Array} current 待扩展对象
 * @param {Object|Array} target 目标对象
 *
 * @returns {Object|Array} current 待扩展对象
 */
function extend(current: any, target: any, filter?: Filter, deep?: number) {
  deep || (deep = 0)

  let currentValue
  let targetValue

  let temp: any
  let key: string
  for (key in target) {
    currentValue = current[key]
    targetValue = target[key]

    temp =
      filter && filter(key, targetValue, currentValue, current, target, deep)
    if (temp) {
      hasOwnProperty(temp, 'value') && (current[key] = temp.value)
    } else if (!targetValue || !isObj(targetValue)) {
      current[key] = targetValue
    } else {
      current[key] = extend(
        ((temp = isArray(targetValue)) === isArray(currentValue) &&
          currentValue) ||
          (temp && []) ||
          {},
        targetValue,
        filter,
        deep + 1
      )
    }
  }

  return current
}
/** 深克隆/扩展 对象/数组(不考虑原型和循环引用)
 * @test true
 *
 * @param {Function} filter 可选，自定义过滤
 * @param {...Rest} 待克隆/扩展的对象/数组列表 只有一个数组/对象时克隆，多个则后面的扩展到第一个对象上
 *
 * @returns {Array|Object} 克隆/扩展的后的对象
 */
const clone = function(this: any) {
  const ARGUMENTS = arguments
  const args: any[] = []

  const filter = isFn(ARGUMENTS[0]) && ARGUMENTS[0]
  let current
  let target

  let temp
  let index = filter ? 1 : 0
  while (index < ARGUMENTS.length) {
    isObj((temp = ARGUMENTS[index++])) &&
      (current
        ? target
          ? args.push(temp)
          : (target = temp)
        : (current = temp))
  }

  if (current) {
    target || (current = isArray((target = current)) ? [] : {})
    extend(current, target, filter)
  }

  if (!args.length) {
    return current
  }

  args.unshift(current)
  filter && args.unshift(filter)
  return clone.apply(this, args)
} as (...args: any[]) => any

/** 设置对象默认值
 * @param {Object|Array} target 目标对象 (被修改)
 * @param {Object|Array} defaultObject 默认值 (不变)
 *
 * @returns {Object|Array} 原target对象
 */
function setDefault(target: any, defaultObject: any) {
  let key
  let temp
  for (key in defaultObject) {
    if (hasOwnProperty(target, key)) {
      ;(temp = target[key]) &&
        isObj(temp) &&
        (key = defaultObject[key]) &&
        isObj(key) &&
        setDefault(temp, key)
    } else {
      target[key] = isObj((temp = defaultObject[key])) ? clone(temp) : temp
    }
  }

  return target
}

export { clone as default, setDefault }
