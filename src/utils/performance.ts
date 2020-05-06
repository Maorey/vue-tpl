/** 性能优化相关工具函数 */
import { hasOwn, isNumber } from '.'

type throttleDebounce = <T extends Function>(
  fn: T,
  interval?: number,
  scope?: any
) => T

/** 节流 (指定时间间隔内最多执行一次函数 延迟执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 * @param {any} scope 绑定函数this指向
 *
 * @returns {Function} 目标函数包装
 */
const throttle = function(fn: Function, interval?: number, scope?: any) {
  let runable = true
  let _arg: any
  const FN = () => {
    fn.apply(scope, _arg)
    runable = true
  }

  const hasScope = arguments.length > 2
  return function(this: any) {
    hasScope || (scope = this)
    _arg = arguments

    if (runable) {
      runable = false
      setTimeout(FN, interval)
    }
  }
} as throttleDebounce
/** 防抖 (限制函数最小执行间隔 延迟执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 * @param {any} scope 绑定函数this指向
 *
 * @returns {Function} 目标函数包装
 */
const debounce = function(fn: Function, interval?: number, scope?: any) {
  let _arg: any
  const FN = () => {
    fn.apply(scope, _arg)
  }

  let timer: number
  const hasScope = arguments.length > 2
  return function(this: any) {
    hasScope || (scope = this)
    _arg = arguments

    clearTimeout(timer)
    timer = setTimeout(FN, interval)
  }
} as throttleDebounce

/** 节流 (指定时间间隔内最多执行一次函数 立即执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 * @param {any} scope 绑定函数this指向
 *
 * @returns {Function} 目标函数包装
 */
const throttleAtOnce = function(fn: Function, interval?: number, scope?: any) {
  let runable = true
  const FN = () => {
    runable = true
  }

  const hasScope = arguments.length > 2
  return function(this: any) {
    if (runable) {
      runable = false
      fn.apply(hasScope ? scope : this, arguments)
      setTimeout(FN, interval)
    }
  }
} as throttleDebounce
/** 防抖 (限制函数最小执行间隔 立即执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 * @param {any} scope 绑定函数this指向
 *
 * @returns {Function} 目标函数包装
 */
const debounceAtOnce = function(fn: Function, interval?: number, scope?: any) {
  let runable = true
  const FN = () => {
    runable = true
  }

  let timer: number
  const hasScope = arguments.length > 2
  return function(this: any) {
    if (runable) {
      runable = false
      fn.apply(hasScope ? scope : this, arguments)
    }

    clearTimeout(timer)
    timer = setTimeout(FN, interval)
  }
} as throttleDebounce

/// 装饰器 ///
interface IThrottleDebounceDecorator {
  <T>(params?: number | { interval?: number; scope?: any }): MethodDecorator
}
interface IThrottleDebounceDecorator {
  <T, R>(
    target: T,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => R>
  ): void
}
const factory = (fn: throttleDebounce): IThrottleDebounceDecorator => (
  targetOrParams?: any,
  key?: any,
  descriptor?: any
) => {
  // for Class不同实例
  const FN = function() {
    const args = arguments
    return function(this: any) {
      this._$e || (this._$e = fn.apply(this, args as any))
      this._$e.apply(this, arguments as any)
    }
  } as throttleDebounce

  return descriptor
    ? ((descriptor.value = FN(targetOrParams[key])), descriptor)
    : (target: any, key: string, descriptor: PropertyDescriptor) => {
      descriptor.value = isNumber(targetOrParams)
        ? FN(target[key], targetOrParams)
        : hasOwn(targetOrParams, 'scope')
          ? FN(target[key], targetOrParams.interval, targetOrParams.scope)
          : FN(target[key], targetOrParams.interval)
      return descriptor
    }
}

/** 节流装饰器 (指定时间间隔内最多执行一次函数 延迟执行)
 *
 * @param targetOrParams 参数
 * @param key
 * @param descriptor
 * @constructor
 */
const Throttle = factory(throttle)
/** 防抖装饰器 (限制函数最小执行间隔 延迟执行)
 *
 * @param targetOrParams 参数
 * @param key
 * @param descriptor
 * @constructor
 */
const Debounce = factory(debounce)

/** 节流装饰器 (指定时间间隔内最多执行一次函数 立即执行)
 *
 * @param targetOrParams 参数
 * @param key
 * @param descriptor
 * @constructor
 */
const ThrottleAtOnce = factory(throttleAtOnce)
/** 防抖装饰器 (限制函数最小执行间隔 立即执行)
 *
 * @param targetOrParams 参数
 * @param key
 * @param descriptor
 * @constructor
 */
const DebounceAtOnce = factory(debounceAtOnce)

export {
  throttle,
  debounce,
  throttleAtOnce,
  debounceAtOnce,
  Throttle,
  Debounce,
  ThrottleAtOnce,
  DebounceAtOnce,
}
