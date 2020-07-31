/** 工具函数 */

/** 对象自身是否存在指定属性 (查找原型链请用 key in obj 判断)
 * @test true
 *
 * @param obj 目标对象
 * @param key 目标键
 *
 * @returns Boolean
 */
function hasOwn<T>(obj: T, key?: string | number | symbol): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key as any)
}

/** 获取精确类型
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

/** 值是否为: 指定类型 [注意]无法检查具体类型,比如:is(Class A, Class B)
 * @test true
 *
 * @param value 目标类型(字符串或值)
 *
 * @returns Boolean
 */
function is<T>(value?: unknown, type?: string | T): value is T {
  const typeType = getType(type)
  value = getType(value)
  return value === typeType || (typeType === 'string' && value === type)
}

/** 值是否为: undefined
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isUndef(value?: unknown): value is undefined {
  return value === undefined
}

/** 值是否为: null
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isNull(value?: unknown): value is null {
  return value === null
}

/** 值是否为: null/undefined
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isNullish(value?: unknown): value is null | undefined {
  return isUndef(value) || isNull(value)
}

/** 值是否[不为]: null/undefined
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isDef(
  value?: unknown
): value is Exclude<Record<string, any>, null | undefined> {
  return !isNullish(value)
}

/** 值是否为: Boolean
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isBool(value?: unknown): value is boolean {
  return typeof value === 'boolean'
}

/** 值是否为: Number
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isNumber(value?: unknown): value is number {
  return typeof value === 'number'
}

/** 值是否为: BigInt
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isBigInt(value?: unknown): value is bigint {
  return getType(value) === 'bigint'
}

/** 值是否为: String
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isString(value?: unknown): value is string {
  return typeof value === 'string'
}

/** 值是否为: Symbol
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isSymbol(value?: unknown): value is symbol {
  return getType(value) === 'symbol'
}

/** 值是否为: Object/Array/RegExp/...
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isObj(value?: unknown): value is object {
  return typeof value === 'object'
}

/** 值是否为: Object
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isObject(value?: unknown): value is object {
  return getType(value) === 'object'
}

/** 值是否为: Array
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isArray(value?: unknown): value is unknown[] {
  return getType(value) === 'array' // Array.isArray(value)
}

/** 值是否为: Function
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isFn(value?: unknown): value is Function {
  return typeof value === 'function'
}

/** 值是否为: RegExp
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isReg(value?: unknown): value is RegExp {
  return getType(value) === 'regexp'
}

/** 值是否为: Date
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isDate(value?: unknown): value is Date {
  return getType(value) === 'date'
}

/** 值是否为: Promise
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isPromise(value?: unknown): value is Promise<any> {
  return isDef(value) && isFn(value.then) && isFn(value.catch)
}

/** 是否空对象/数组
 * @param value 对象或数组
 */
function isEmpty(value: object | any[]) {
  if (value) {
    let key
    for (key in value) {
      return false
    }
  }
  return true
}

/** 比较值最大调用栈深度 */
const maxEqualStack = 32
/** 两个变量是否相等
 *
 * @test true
 *
 * @param x 第一个值
 * @param y 第二个值
 * @param noRef 是否不比较引用类型的值(对象/数组可枚举属性(含原型),{a:undefined}等于{})
 *    【不处理循环引用】(比如a.b=a,可以用WeakSet记录和判断指针是否重复出现)
 *
 * @returns Boolean
 */
function isEqual(x?: any, y?: any, noRef?: boolean): boolean
function isEqual(x?: any, y?: any, noRef?: boolean, deep?: number) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y // isEqual(0, -0) => false
  }

  // eslint-disable-next-line no-self-compare
  if (x !== x && y !== y) {
    return true // isEqual(NaN, NaN) => true
  }

  if (noRef) {
    return false
  }

  if ((deep = (deep || 0) + 1) > maxEqualStack) {
    return true
  }

  // noRef: 工具人 非array/object/regexp只执行一次getType
  if ((noRef = getType(x) as any) === 'object') {
    if ((noRef as any) !== getType(y)) {
      return false // 先比较Object.keys()长度不太划算
    }

    const KEYS: { [key: string]: 1 } = {}
    for (noRef as any in x) {
      if (!(isEqual as any)(x[noRef as any], y[noRef as any], false, deep)) {
        return false
      }
      KEYS[noRef as any] = 1
    }

    for (noRef as any in y) {
      if (!KEYS[noRef as any]) {
        return false
      }
    }

    return true
  }

  if ((noRef as any) === 'array') {
    if ((noRef as any) !== getType(y) || (noRef = x.length) !== y.length) {
      return false
    }

    while ((noRef as any)--) {
      if (!(isEqual as any)(x[noRef as any], y[noRef as any], false, deep)) {
        return false
      }
    }

    return true
  }

  // if ((noRef as any) === 'regexp') {
  //   return (
  //     (noRef as any) === getType(y) &&
  //     x.lastIndex === y.lastIndex &&
  //     x.toString() === y.toString()
  //   )
  // }

  return false
}

/** 去首尾空格(对象/数组直接修改) */
function trim<T = string | object | any[]>(object?: T): T {
  if (isString(object)) {
    object = object.trim() as any
  } else if (object && isObj(object)) {
    let key
    for (key in object) {
      ;(object as any)[key] = trim((object as any)[key])
    }
  }

  return object as T
}

let passive: any = 0
/** 浏览器是否支持passive事件监听
 *    see: https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
 */
function isPassive() {
  if (passive !== 0) {
    return passive
  }

  try {
    window.addEventListener(
      0 as any,
      null as any,
      Object.defineProperty({}, 'passive', {
        get() {
          passive = { passive: true }
          return true
        },
      })
    )
  } catch (err) {
    passive = false
  }
  return passive as false | { passive: true }
}

export {
  hasOwn,
  getType,
  is,
  isUndef,
  isNull,
  isNullish,
  isDef,
  isBool,
  isNumber,
  isBigInt,
  isString,
  isSymbol,
  isObj,
  isObject,
  isArray,
  isFn,
  isReg,
  isDate,
  isPromise,
  isEmpty,
  isEqual,
  isPassive,
  trim,
}
