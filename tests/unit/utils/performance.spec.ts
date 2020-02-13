/** 性能优化相关工具函数
 */
import {
  throttle,
  debounce,
  throttleAtOnce,
  debounceAtOnce,
} from '@/utils/performance'

describe('@/utils/performance: 性能优化相关工具函数', () => {
  it('throttle 节流（延迟执行）', done => {
    let countIt = 0
    let countFn = 0

    const interval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      test(countIt++)
    }, 4)

    const test = throttle((num: number) => {
      countFn++
      if (num > 1) {
        expect(countFn).toBe(1)
        clearInterval(interval)
        done()
      }
    }, 8)
  })
  it('throttleAtOnce 节流（立即执行）', done => {
    let countIt = 0
    let countFn = 0

    const interval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      test(countIt++)
    }, 4)

    const test = throttleAtOnce((num: number) => {
      countFn++
      if (num > 1) {
        expect(countFn).toBe(2)
        clearInterval(interval)
        done()
      }
    }, 8)
  })

  it('debounce 防抖（延迟执行）', done => {
    let countIt = 0
    let countFn = 0

    let interval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      test(countIt++)
      if (countIt > 1) {
        expect(countFn).toBe(0)
        clearInterval(interval)

        interval = setInterval(() => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          test(countIt++)
        }, 8)
      }
    })

    const test = debounce((num: number) => {
      countFn++
      if (num > 2) {
        expect(countFn).toBe(3)
        clearInterval(interval)
        done()
      }
    }, 4)
  })
  it('debounceAtOnce 防抖（立即执行）', done => {
    let countIt = 0
    let countFn = 0

    let interval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      test(countIt++)
      if (countIt > 1) {
        expect(countFn).toBe(1)
        clearInterval(interval)

        interval = setInterval(() => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          test(countIt++)
        }, 8)
      }
    })

    const test = debounceAtOnce((num: number) => {
      countFn++
      if (num > 2) {
        expect(countFn).toBe(3)
        clearInterval(interval)
        done()
      }
    }, 4)
  })
})
