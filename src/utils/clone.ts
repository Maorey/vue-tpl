/*
 * @Description: 深克隆/扩展 对象/数组(不考虑原型和循环引用)
 * @Author: 毛瑞
 * @Date: 2019-06-27 12:58:37
 */
import { hasOwn, isObj, isFn } from '.'

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
  deep: number
) => { value: any } | boolean | undefined | null | void

/** 深扩展一个对象/数组
 * @param {Object|Array} current 待扩展对象
 * @param {Object|Array} target 目标对象
 *
 * @returns {Object|Array} current 待扩展对象
 */
function extend<T = any, U = any>(
  current: T,
  target: U,
  filter?: Filter,
  deep?: number
): T & U {
  deep || (deep = 0)

  let currentValue
  let targetValue
  let temp: any
  let key: string
  for (key in target) {
    targetValue = (target as any)[key]
    currentValue = (current as any)[key]

    temp =
      filter && filter(key, targetValue, currentValue, current, target, deep)
    if (temp) {
      hasOwn(temp, 'value') && ((current as any)[key] = temp.value)
    } else if (targetValue && isObj(targetValue)) {
      ;(current as any)[key] = extend(
        (Array.isArray(currentValue) === (temp = Array.isArray(targetValue)) &&
          currentValue) ||
          (temp ? [] : {}),
        targetValue,
        filter,
        deep + 1
      )
    } else {
      ;(current as any)[key] = targetValue
    }
  }

  return current as T & U
}
/** 深克隆/扩展 对象/数组【含原型,不处理循环引用】
 * @test true
 *
 * @param {Filter} filter 可选，自定义过滤
 * @param {...Rest} 待克隆/扩展的对象/数组列表 只有一个数组/对象时克隆，多个则后面的扩展到第一个对象上
 *
 * @returns {Array|Object} 克隆/扩展的后的对象
 */
function clone<T = any, U = T>(current?: T, target?: U, ...args: any[]): T & U
function clone<T = any, U = T>(
  filter?: Filter,
  current?: T,
  target?: U,
  ...args: any[]
): T & U
function clone() {
  const ARGS = arguments
  const filter = isFn(ARGS[0]) && ARGS[0]

  let current
  let extended

  for (let i = filter ? 1 : 0, len = ARGS.length, item; i < len; i++) {
    if (isObj((item = ARGS[i]))) {
      if (current) {
        extend(current, item, filter)
        extended = true
      } else {
        current = item
      }
    }
  }

  return extended
    ? current
    : current && extend(Array.isArray(current) ? [] : {}, current, filter)
}

/** 设置对象默认值
 * @param {Object|Array} current 目标对象 (被修改)
 * @param {Object|Array} target 默认值 (不变)
 *
 * @returns {Object|Array} 原target对象
 */
function setDefault<T = any, U = any>(current: T, target: U): T & U {
  let key
  let temp
  for (key in target) {
    if (hasOwn(current, key)) {
      ;(temp = (current as any)[key]) &&
        isObj(temp) &&
        (key = (target as any)[key]) &&
        isObj(key) &&
        setDefault(temp, key)
    } else {
      ;(current as any)[key] = isObj((temp = (target as any)[key]))
        ? clone(temp)
        : temp
    }
  }

  return current as T & U
}

/** 设置类成员默认值装饰器
 * @param keyOrValue class的key, 或成员的默认值
 * @param value 默认值 (不变)
 */
function Default<T>(value: any): MethodDecorator
function Default<T>(key: string, value: any): ClassDecorator
function Default(keyOrValue: any, value?: any) {
  return (target: any, key?: any, descriptor?: any) => {
    if (descriptor) {
      descriptor.value =
        isObj(target[key]) && isObj(keyOrValue)
          ? setDefault(target[key], keyOrValue)
          : keyOrValue
      return descriptor
    }

    target = target.prototype
    target[keyOrValue] =
      isObj(target[keyOrValue]) && isObj(value)
        ? setDefault(target[keyOrValue], value)
        : value
  }
}

export { clone as default, setDefault, Default }
