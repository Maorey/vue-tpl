/** 简版响应式系统 (使用 Object.defineProperty) */
interface IEffect<T extends (...args: any[]) => any = (...args: any[]) => any> {
  (): ReturnType<T>
  _f: T
}

const targetMap = new WeakMap<IObject, IObject<Set<IEffect>>>()
let activeEffect: IEffect | 0

/** 订阅指定对象的指定属性
 * @test true
 *
 * @param {String} key 目标属性[默认 value]
 * @param {Object} target 目标对象[默认 {}]
 *
 * @returns {Object} 目标对象
 */
function watch(key?: string, target?: IObject) {
  key || (key = 'value')
  target ? targetMap.delete(target) : (target = {})

  let local: any = target[key]
  try {
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (activeEffect) {
          // 自动订阅(收集依赖)
          let depsMap = targetMap.get(this)
          depsMap || targetMap.set(this, (depsMap = {}))
          if (depsMap[key as string]) {
            depsMap[key as string].add(activeEffect)
          } else {
            depsMap[key as string] = new Set<IEffect>().add(activeEffect)
          }
          activeEffect = 0
        }

        return local
      },
      set(value: any) {
        if (!Object.is(local, value)) {
          local = value
          // 发布/通知
          const depsMap = targetMap.get(this)
          const depsSet = depsMap && depsMap[key as string]
          if (depsSet) {
            let effect
            for (effect of depsSet) {
              effect()
            }
          }
        }
      },
    })
  } catch (error) {
    console.error('watch:', target, key, error)
  }

  return target
}

/** 取消订阅指定对象的指定属性
 * @test true
 *
 * @param {Object} target 目标对象
 * @param {String} key 目标属性[默认 value]
 * @param {Function} fn 回调函数 缺省则移除全部
 */
function unWatch(target: IObject, key?: string, fn?: Function) {
  key || (key = 'value')

  const depsMap = targetMap.get(target)
  const depsSet = depsMap && depsMap[key]
  if (depsSet) {
    if (fn) {
      let effect
      for (effect of depsSet) {
        if (fn === effect._f) {
          depsSet.delete(effect)
          if (depsSet.size) {
            return true
          } else {
            fn = 0 as any
            break
          }
        }
      }
    }

    if (!fn) {
      Object.defineProperty(target, key, {
        writable: true,
        enumerable: true,
        configurable: true,
      })
      targetMap.delete(target)
      return true
    }
  }
}

/** 运行副作用函数, 自动订阅目标函数(同步)
 * @test true
 *
 * @param {Function} fn 副作用函数
 */
function run<T extends(...args: any[]) => any>(
  fn: T,
  scope?: any,
  args?: any[]
): T {
  const hasScope = arguments.length > 1
  const hasArgs = arguments.length > 2
  function wrappedFn(this: any) {
    activeEffect = wrappedFn as IEffect
    activeEffect._f = fn

    return fn.apply(
      hasScope ? scope : this,
      (hasArgs ? args : arguments) as any
    )
  }

  wrappedFn() // 立即运行
  return wrappedFn as T
}

export { watch, unWatch, run }
