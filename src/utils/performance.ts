/** 性能优化相关工具
 */

/** 节流 (指定时间间隔内最多执行一次函数 立即执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 *
 * @returns {Function} 目标函数包装
 */
function throttle(fn: Function, interval: number) {
  let runable = true
  const FN = () => {
    runable = true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function(this: any, ..._args: any[]) {
    if (runable) {
      runable = false
      setTimeout(FN, interval)
      fn.apply(this, arguments)
    }
  }
}

/** 防抖 (限制函数最小执行间隔 立即执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 *
 * @returns {Function} 目标函数包装
 */
function debounce(fn: Function, interval: number) {
  let timer: number
  let runable = true
  const FN = () => {
    runable = true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function(this: any, ..._args: any[]) {
    if (runable) {
      runable = false
      fn.apply(this, arguments)
    }
    clearTimeout(timer)
    timer = setTimeout(FN, interval)
  }
}

/** 节流 (指定时间间隔内最多执行一次函数 延迟执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 *
 * @returns {Function} 目标函数包装
 */
function throttleDelay(fn: Function, interval: number) {
  let runable = true

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function(this: any, ..._args: any[]) {
    if (runable) {
      runable = false
      setTimeout(() => {
        fn.apply(this, arguments)
        runable = true
      }, interval)
    }
  }
}

/** 防抖 (限制函数最小执行间隔 延迟执行)
 * @test true
 *
 * @param {Function} fn 目标函数
 * @param {Number} interval 间隔(ms)
 *
 * @returns {Function} 目标函数包装
 */
function debounceDelay(fn: Function, interval: number) {
  let timer: number

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function(this: any, ..._args: any[]) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, interval)
  }
}

export { throttle, debounce, throttleDelay, debounceDelay }
