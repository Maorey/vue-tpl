/** 工具函数 */
import { VueConstructor } from 'vue'

/** 对象自身是否存在指定属性 (查找原型链请用 key in obj 判断)
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

/** 值是否为: undefined
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isUndef(value?: any) {
  return value === undefined
}

/** 值是否为: null
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isNull(value?: any) {
  return value === null
}

/** 值是否为: null/undefined
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isNullish(value?: any) {
  return isUndef(value) || isNull(value)
}

/** 值是否为: Boolean
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isBool(value?: any) {
  return typeof value === 'boolean'
}

/** 值是否为: Number
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isNumber(value?: any) {
  return typeof value === 'number'
}

/** 值是否为: BigInt
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isBigInt(value?: any) {
  return getType(value) === 'bigint'
}

/** 值是否为: String
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isString(value?: any) {
  return typeof value === 'string'
}

/** 值是否为: Symbol
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isSymbol(value?: any) {
  return getType(value) === 'symbol'
}

/** 值是否为: Object/Array/RegExp/...
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isObj(value?: any) {
  return typeof value === 'object'
}

/** 值是否为: Object
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isObject(value?: any) {
  return getType(value) === 'object'
}

/** 值是否为: Array
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isArray(value?: any) {
  return getType(value) === 'array' // Array.isArray(value)
}

/** 值是否为: Function
 * @test true
 *
 * @param value 目标值
 *
 * @returns Boolean
 */
function isFn(value?: any) {
  return typeof value === 'function'
}

/** 比较两个值是否相等(对象和数组比较原型上可枚举属性,{a:undefined}等于{},支持正则对象比较)
 *    (函数因为作用域问题无法比较)
 * @test true
 *
 * @param x 第一个值
 * @param y 第二个值
 *
 * @returns Boolean
 */
function isEqual(x?: any, y?: any): boolean {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y // isEqual(0, -0) => false
  }

  // eslint-disable-next-line no-self-compare
  if (x !== x && y !== y) {
    return true // isEqual(NaN, NaN) => true
  }

  let temp // 工具人 非array/object/regexp只执行一次getType
  if ((temp = getType(x)) === 'object') {
    if (temp !== getType(y)) {
      return false // 先比较Object.keys()长度不太划算
    }

    const KEYS: IObject<1> = {}
    for (temp in x) {
      if (!isEqual(x[temp], y[temp])) {
        return false
      }
      KEYS[temp] = 1
    }

    for (temp in y) {
      if (!KEYS[temp]) {
        return false
      }
    }

    return true
  }

  if (temp === 'array') {
    if (temp !== getType(y) || (temp = x.length) !== y.length) {
      return false
    }

    while (temp--) {
      if (!isEqual(x[temp], y[temp])) {
        return false
      }
    }

    return true
  }

  if (temp === 'regexp') {
    return (
      temp === getType(y) &&
      x.lastIndex === y.lastIndex &&
      x.toString() === y.toString()
    )
  }

  return false
}

/** 开发环境处理
 * @param Vue
 */
function dev(Vue: VueConstructor) {
  // 在浏览器开发工具的性能/时间线面板中启用Vue组件性能追踪 && 更友好的组件名(vue-devtool)
  ;(Vue.config.performance = process.env.NODE_ENV === 'development') &&
    Vue.mixin({
      beforeCreate() {
        let options
        options = this.$options
        options ||
          ((options = this.$vnode) &&
            (options = options.componentOptions) &&
            (options = options.Ctor) &&
            (options = (options as any).options))

        // 匿名组件就不处理了 vue-devtool自己找 $vm0.$options.__file
        if (options && options.__file && /^default/i.test(options.name)) {
          const result = /(?:[\\/]([^\\/]+)[\\/])?([^\\/]+)(?:[\\/]index)?\.\w+/.exec(
            options.__file
          )
          result && (options.name = result[1] + result[2])
        }
      },
    })
}

export {
  hasOwnProperty,
  getType,
  isUndef,
  isNull,
  isNullish,
  isBool,
  isNumber,
  isBigInt,
  isString,
  isSymbol,
  isObj,
  isObject,
  isArray,
  isFn,
  isEqual,
  dev,
}
