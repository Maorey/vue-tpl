/** 性能优化相关工具
 */
import {
  throttle,
  debounce,
  throttleDelay,
  debounceDelay,
} from '@/utils/performance'

describe('@/utils: 工具函数', () => {
  it('throttle 节流（立即执行）', done => {
    let countIt = 0
    const interval = setInterval(() => {
      test(countIt++)
    }, 4)

    let countFn = 0
    const test = throttle((num: number) => {
      countFn++
      if (num > 2) {
        expect(countFn).toBe(2)
        clearInterval(interval)
        done()
      }
    }, 8)
  })
  it('throttleDelay 节流（延迟执行）', done => {
    let countIt = 0
    const interval = setInterval(() => {
      test(countIt++)
    }, 4)

    let countFn = 0
    const test = throttleDelay((num: number) => {
      countFn++
      if (num > 1) {
        expect(countFn).toBe(2)
        clearInterval(interval)
        done()
      }
    }, 8)
  })

  it('debounce 防抖（立即执行）', done => {
    let countIt = 0
    let interval = setInterval(() => {
      test(countIt++)
      if (countIt > 2) {
        expect(countFn).toBe(1)
        clearInterval(interval)

        interval = setInterval(() => {
          test(countIt++)
        }, 8)
      }
    })

    let countFn = 0
    const test = debounce((num: number) => {
      countFn++
      if (num > 3) {
        expect(countFn).toBe(3)
        clearInterval(interval)
        done()
      }
    }, 4)
  })
  it('debounceDelay 防抖（延迟执行）', done => {
    let countIt = 0
    let interval = setInterval(() => {
      test(countIt++)
      if (countIt > 2) {
        expect(countFn).toBe(0)
        clearInterval(interval)

        interval = setInterval(() => {
          test(countIt++)
        }, 8)
      }
    })

    let countFn = 0
    const test = debounceDelay((num: number) => {
      countFn++
      if (num > 3) {
        expect(countFn).toBe(3)
        clearInterval(interval)
        done()
      }
    }, 4)
  })
})
