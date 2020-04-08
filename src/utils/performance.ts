/** 性能优化相关工具函数
 */

/** 节流 (指定时间间隔内最多执行一次函数 延迟执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 * @param {any} scope 绑定函数this指向
 *
 * @returns {Function} 目标函数包装
 */
function throttle<T extends Function>(
  fn: T,
  interval?: number,
  scope?: any
): T {
  let runable = true
  let _arg: any
  const FN = () => {
    fn.apply(scope, _arg)
    runable = true
  }

  const hasScope = arguments.length > 2
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function(this: any, ..._args: any[]) {
    hasScope || (scope = this)
    _arg = arguments

    if (runable) {
      runable = false
      setTimeout(FN, interval)
    }
  } as any
}
/** 防抖 (限制函数最小执行间隔 延迟执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 * @param {any} scope 绑定函数this指向
 *
 * @returns {Function} 目标函数包装
 */
function debounce<T extends Function>(
  fn: T,
  interval?: number,
  scope?: any
): T {
  let _arg: any
  const FN = () => {
    fn.apply(scope, _arg)
  }

  let timer: number
  const hasScope = arguments.length > 2
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function(this: any, ..._args: any[]) {
    hasScope || (scope = this)
    _arg = arguments

    clearTimeout(timer)
    timer = setTimeout(FN, interval)
  } as any
}

/** 节流 (指定时间间隔内最多执行一次函数 立即执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 * @param {any} scope 绑定函数this指向
 *
 * @returns {Function} 目标函数包装
 */
function throttleAtOnce<T extends Function>(
  fn: T,
  interval?: number,
  scope?: any
): T {
  let runable = true
  const FN = () => {
    runable = true
  }

  const hasScope = arguments.length > 2
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function(this: any, ..._args: any[]) {
    if (runable) {
      runable = false
      fn.apply(hasScope ? scope : this, arguments)
      setTimeout(FN, interval)
    }
  } as any
}
/** 防抖 (限制函数最小执行间隔 立即执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 * @param {any} scope 绑定函数this指向
 *
 * @returns {Function} 目标函数包装
 */
function debounceAtOnce<T extends Function>(
  fn: T,
  interval?: number,
  scope?: any
): T {
  let runable = true
  const FN = () => {
    runable = true
  }

  let timer: number
  const hasScope = arguments.length > 2
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function(this: any, ..._args: any[]) {
    if (runable) {
      runable = false
      fn.apply(hasScope ? scope : this, arguments)
    }

    clearTimeout(timer)
    timer = setTimeout(FN, interval)
  } as any
}

export { throttle, debounce, throttleAtOnce, debounceAtOnce }
