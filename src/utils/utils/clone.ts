/*
 * @Description: 深克隆/扩展 对象/数组(无其他原型和循环引用)
 * @Author: 毛瑞
 * @Date: 2019-06-27 12:58:37
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-04 12:36:44
 */

/** 克隆过滤函数返回值
 */
interface IClone {
  /** 不拷贝该属性
   */
  jump?: boolean
  /** 替换值
   */
  value?: any
}

/** 深扩展一个对象/数组
 * @param {Array|Object} source 待扩展对象
 * @param {Array|Object} target 目标对象
 *
 * @returns {Array|Object} source 待扩展对象
 */
function extend(
  source: any | any[],
  target: any | any[],
  deep?: number, // 递归层级
  filter?: (
    key: string, // 待拷贝属性
    targetValue: any, // 目标值
    currentValue: any, // 当前值
    currentObject: any | any[], // 当前对象
    targetObject: any | any[], // 目标对象
    deep?: number // 递归层级
  ) => undefined | false | IClone
): any | any[] {
  let currentValue: any
  let targetValue: any

  let tmp: any
  let key: string
  for (key in target) {
    currentValue = source[key]
    targetValue = target[key]

    tmp = filter && filter(key, targetValue, currentValue, source, target, deep)
    if (tmp) {
      tmp.jump || (source[key] = tmp.value) // 自定义拷贝
    } else if (!targetValue || typeof targetValue !== 'object') {
      source[key] = targetValue // 拷贝值
    } else {
      // 当前类型应与目标相同（数组/对象）
      tmp = Array.isArray(targetValue) // 目标是否数组
      Array.isArray(currentValue) === tmp || (currentValue = 0) // 类型不同

      source[key] = extend(
        currentValue || (tmp ? [] : {}),
        targetValue,
        (deep || 0) + 1,
        filter
      )
    }
  }

  return source
}
/** 深克隆/扩展 对象/数组(无其他原型和循环引用)
 * @param {Function} filter 可选，自定义过滤
 * @param {...Rest} 待克隆/扩展的对象/数组列表 只有一个数组/对象时克隆，多个则后面的扩展到第一个对象上
 *
 * @returns {Array|Object} 克隆/扩展的后的对象
 */
function clone(...args: any[]): any {
  let filter:
    | ((
        key: string, // 待拷贝属性
        valueValue: any, // 目标值
        currentValue: any, // 当前值
        currentObject: any[] | object, // 当前对象
        targetObject: any[] | object, // 目标对象
        deep?: number // 递归层级
      ) => undefined | false | IClone)
    | undefined
  typeof args[0] === 'function' && (filter = args.shift())

  let argsLength: number = args.length

  // 找到待克隆的对象/数组 / 第一个待扩展的对象/数组 / 下一个待扩展的对象/数组
  let current: any
  let target: any
  let next: any
  let tmp: any
  let index: number = 0
  while (index < argsLength) {
    tmp = args[index]
    if (typeof tmp === 'object') {
      if (!current) {
        current = tmp
      } else if (!target) {
        target = tmp
      } else if (!next) {
        next = tmp
        break
      }
      index++
    } else {
      args.splice(index, 1)
      argsLength--
    }
  }

  if (argsLength === 1) {
    // 一个参数时克隆当前对象
    target = current
    current = Array.isArray(target) ? [] : {}
  }

  current && target && extend(current, target, 0, filter)

  if (!next) {
    // 没有下一项
    return current
  }

  args = args.slice(index)
  return filter ? clone(filter, current, ...args) : clone(current, ...args)
}

export default clone
