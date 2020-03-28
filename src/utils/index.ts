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
  value = Object.prototype.toString.call(value) // [object type]
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

/** 比较两个值是否相等 (对象和数组比较值, 包括原型上可枚举属性, { a: undefined } 与 {} 视为相等)
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

  if (type === 'number') {
    // if (value) {
    //   return value === target
    // }
    // if (target) {
    //   return false
    // }
    // if (isNaN(value)) {
    //   return isNaN(target)
    // }
    // return 1 / value === 1 / target // 0 === -0 => false
    return value
      ? value === target
      : target
        ? false
        : isNaN(value)
          ? isNaN(target)
          : 1 / value === 1 / target
  }

  if (type === 'array') {
    if (value === target) {
      return true
    }

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
    if (value === target) {
      return true
    }

    const KEYS: IObject<1> = {} // 先比较Object.keys()长度不太划算
    for (type in value) {
      KEYS[type] = 1
      if (!isEqual(value[type], target[type])) {
        return false
      }
    }
    for (type in target) {
      if (!KEYS[type]) {
        return false
      }
    }

    return true
  }

  return value === target
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
