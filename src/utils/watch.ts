/** 响应式工具 (使用 Object.defineProperty)
 */
import { debounce } from './performance'

interface ISubscribe extends Function {
  /** this */
  _t?: any
  /** arguments */
  _a?: any[]
  /** 原函数 */
  _f?: Function
}

const targetMap = new WeakMap<IObject, IObject<Set<ISubscribe>>>()
let effect: ISubscribe | undefined

/** 订阅
 * @param {String} key 订阅属性
 * @param {Object} target 目标对象
 *
 * @returns {Object} 目标对象
 */
function watch(key = 'value', target: IObject = {}) {
  let local: any = target[key]
  try {
    Object.defineProperty(target, key, {
      enumerable: true,
      get() {
        // 收集依赖
        if (effect) {
          let depsMap = targetMap.get(this)
          depsMap || targetMap.set(this, (depsMap = {}))
          if (depsMap[key]) {
            depsMap[key].add(effect)
          } else {
            depsMap[key] = new Set<ISubscribe>().add(effect)
          }
          effect = undefined
        }

        return local
      },
      set(value: any) {
        local = value
        // 使用副作用
        const depsMap = targetMap.get(this)
        const depsSet = depsMap && depsMap[key]
        if (depsSet) {
          for (const effect of depsSet) {
            effect.apply(effect._t, effect._a)
          }
        }
      },
    })
  } catch (error) {}

  return target
}

/** 取消订阅
 * @param {Object} target 目标对象
 * @param {String} key 订阅属性
 * @param {Function} fn 副作用函数 缺省则移除全部
 */
function unWatch(target: IObject, key = 'value', fn?: Function) {
  const depsMap = targetMap.get(target)
  const depsSet = depsMap && depsMap[key]
  if (depsSet) {
    if (fn) {
      for (const FN of depsSet) {
        if (fn === FN._f) {
          depsSet.delete(FN)
          return
        }
      }
    } else {
      depsSet.clear()
    }
  }
}

/** 运行副作用函数, 自动订阅目标函数(同步)
 * @param {Function} fn 副作用函数
 */
function run(fn: Function, _this?: any, _arguments?: any[]) {
  effect = debounce(fn)
  effect._f = fn
  effect._t = _this
  effect._a = _arguments
  fn.apply(_this, _arguments)
}

export { watch, unWatch, run }
