/** 工具函数 */
import Vue, { VueConstructor, Component, AsyncComponent } from 'vue'

/** 对象自身是否存在指定属性 (查找原型链请用 key in obj 判断)
 * @test true
 *
 * @param obj 目标对象
 * @param key 目标键
 *
 * @returns Boolean
 */
function hasOwnProperty<T>(
  obj: T,
  key?: string | number | symbol
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key as any)
}

/** 获取精确类型
 * @test true
 *
 * @param value 目标值
 *
 * @returns String
 */
function getType(value?: any) {
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

/** 比较两个值是否相等(对象和数组比较原型上可枚举属性,{a:undefined}等于{},支持正则对象比较)
 *    (函数因为作用域问题无法比较)
 * @test true
 *
 * @param x 第一个值
 * @param y 第二个值
 *
 * @returns Boolean
 */
function isEqual(x?: any, y?: any) {
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

/** 添加vue监听
 * @param {Object} options 监听对象
 * @param {String} hook 监听事件
 * @param {Function} fn 监听回调
 * @param {Object} scope [可选]绑定回调的this
 */
function setHook(
  options: any,
  hook: string,
  fn: Function | Function[],
  scope?: any
) {
  let originHook
  if (Array.isArray(fn)) {
    for (originHook of fn) {
      setHook(options, hook, originHook, scope)
    }
    return
  }

  originHook = options[hook]
  if (!originHook) {
    originHook = []
  } else if (Array.isArray(originHook)) {
    if (originHook.includes((fn as any)._ || fn)) {
      return
    }
  } else {
    if (originHook === (fn as any)._ || fn) {
      return
    }
    originHook = [originHook]
  }
  if (scope) {
    scope = fn.bind(scope)
    scope._ = fn
    fn = scope
  }
  originHook.unshift(fn)
  options[hook] = originHook
}

function onWake(this: any, to: any, from: any, next: any) {
  this.s_ = 0
  next && setTimeout(next)
}
function onSleep(this: any, to: any, from: any, next: any) {
  if (next) {
    this.s_ = to.matched.length && 1 // for 刷新
    setTimeout(next)
  } else {
    this.s_ = 1
  }
}
/** 对路由组件、<KeepAlive>的组件注入睡眠(装饰器)
 * @param {Component} component 组件选项
 */
function sleep(component: Component | AsyncComponent) {
  component = (component as any).options || component
  const originRender = (component as any).render
  if (!originRender || (component as any).$_s) {
    return
  }
  ;(component as any).$_s = 1
  if ((component as any).functional) {
    const state = Vue.observable({ s_: 0 })
    let vnode: any
    ;(component as any).render = function(h: any, context: any) {
      if (state.s_) {
        return vnode
      }

      let on = context.data
      on = on.on || (on.on = {})
      setHook(on, 'hook:beforeRouteUpdate', onWake, state)
      setHook(on, 'hook:activated', onWake, state)
      setHook(on, 'hook:beforeRouteLeave', onSleep, state)
      setHook(on, 'hook:deactivated', onSleep, state)
      return (vnode = originRender.apply(this, arguments))
    }
    return
  }

  // mixins这个阶段对class based api无效
  const originData = (component as any).data
  ;(component as any).data = function() {
    const data =
      (originData && originData.apply && originData.apply(this, arguments)) ||
      {}
    data.s_ = 0 // 满足/^[&_]/不能转化为响应式属性
    return data
  }
  setHook(component, 'beforeRouteUpdate', onWake)
  setHook(component, 'activated', onWake)
  setHook(component, 'beforeRouteLeave', onSleep)
  setHook(component, 'deactivated', onSleep)
  ;(component as any).render = function() {
    if (this.s_) {
      return this._$n
    }
    return (this._$n = originRender.apply(this, arguments))
  }
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
  isEqual,
  isPassive,
  setHook,
  sleep,
  dev,
}
