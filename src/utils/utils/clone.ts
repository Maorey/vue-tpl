/*
 * @Description: 深克隆/扩展 对象/数组(无其他原型和循环引用)
 * @Author: 毛瑞
 * @Date: 2019-06-27 12:58:37
 */
import { IObject } from '@/types'

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

/** 自定义过滤函数
 * @param {String} key 待拷贝属性
 * @param {Any} targetValue 目标值
 * @param {Any} currentValue 当前值
 * @param {Object|Array} currentObject 当前对象
 * @param {Object|Array} targetObject 目标对象
 * @param {Number} deep 递归层级
 *
 * @returns {void|boolean|IClone}
 */
type Filter = (
  key: string,
  targetValue: any,
  currentValue: any,
  currentObject: IObject | any[],
  targetObject: IObject | any[],
  deep?: number
) => void | boolean | IClone

/** 深扩展一个对象/数组
 * @param {Object|Array} source 待扩展对象
 * @param {Object|Array} target 目标对象
 *
 * @returns {Object|Array} source 待扩展对象
 */
function extend(
  source: IObject | any[] | any,
  target: IObject | any[] | any,
  filter?: Filter,
  deep?: number
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
        filter,
        (deep || 0) + 1
      )
    }
  }

  return source
}
/** 深克隆/扩展 对象/数组(无其他原型和循环引用)
 * @test true
 *
 * @param {Function} filter 可选，自定义过滤
 * @param {...Rest} 待克隆/扩展的对象/数组列表 只有一个数组/对象时克隆，多个则后面的扩展到第一个对象上
 *
 * @returns {Array|Object} 克隆/扩展的后的对象
 */
function clone(...args: any[]): any {
  let filter: Filter | undefined
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

  current && target && extend(current, target, filter, 0)

  if (!next) {
    // 没有下一项
    return current
  }

  args = args.slice(index)
  return filter ? clone(filter, current, ...args) : clone(current, ...args)
}

export default clone
