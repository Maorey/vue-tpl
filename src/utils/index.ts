/** 工具函数 */

/** 目标自身是否存在指定属性 (查找原型链请用 key in obj 判断)
 * @test true
 *
 * @param obj 目标对象
 * @param key 目标键
 *
 * @returns Boolean
 */
function hasOwnProperty(obj: any, key?: any) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/** 获取目标值类型
 * @test true
 *
 * @param value 目标值
 *
 * @returns String
 */
function getType(value?: any): string {
  value = Object.prototype.toString.call(value)
  return value.substring(8, value.length - 1).toLowerCase()
}

/** 目标值是否数字
 * @test true
 *
 * @param value 目标值
 * @param str 是否包括字符串 默认true
 * @param nan 是否包括NaN 默认false
 *
 * @returns Boolean
 */
function isNumber(value?: any, str?: boolean, nan?: boolean) {
  str !== false && typeof value === 'string' && (value = parseFloat(value))
  return nan
    ? typeof value === 'number'
    : !isNaN(value) && typeof value === 'number'
}

/** 目标是否未定义
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isUndef(value?: any) {
  return value === undefined
}

/** 目标是否是null
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isNull(value?: any) {
  return value === null
}

/** 目标是否是null或undefined
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isNullish(value?: any) {
  return isUndef(value) || isNull(value)
}

/** 目标是否是布尔值
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isBool(value?: any) {
  return typeof value === 'boolean'
}

/** 目标是否是字符串
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isString(value?: any) {
  return typeof value === 'string'
}

/** 目标是否是对象/数组
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isObj(value?: any) {
  return typeof value === 'object'
}

/** 目标是否是数组
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isArray(value?: any) {
  return getType(value) === 'array' // Array.isArray(value)
}

/** 目标是否是对象
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isObject(value?: any) {
  return isObj(value) && !isArray(value)
}

/** 目标是否是函数
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isFn(value?: any) {
  return typeof value === 'function'
}

/** 比较两个值是否相等 (对象和数组比较值)
 * @test true
 *
 * @param value 当前值
 * @param target 目标值
 *
 * @returns Boolean
 */
function isEqual(value?: any, target?: any): boolean {
  let type
  if ((type = getType(value)) !== getType(target)) {
    return false
  }

  if (type === 'array') {
    if ((type = value.length) !== target.length) {
      return false
    }

    while (type--) {
      if (!isEqual(value[type], target[type])) {
        return false
      }
    }

    return true
  }

  if (type === 'object') {
    // { a: undefined } {} 视为相同
    const KEYS: IObject<1> = {} // for 性能
    for (type in value) {
      KEYS[type] = 1
      if (!isEqual(value[type], target[type])) {
        return false
      }
    }
    for (type in target) {
      if (!KEYS[type]) {
        KEYS[type] = 1
        if (!isEqual(value[type], target[type])) {
          return false
        }
      }
    }

    return true
  }

  return isNaN(value) ? isNaN(target) : value === target
}

export {
  hasOwnProperty,
  getType,
  isNumber,
  isUndef,
  isNull,
  isNullish,
  isBool,
  isString,
  isObj,
  isArray,
  isObject,
  isFn,
  isEqual,
}
