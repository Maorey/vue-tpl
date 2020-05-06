/** 响应式工具
 */
import { watch, unWatch, run } from '@/utils/watch'

describe('@/utils/watch: 响应式工具', () => {
  it('watch 订阅对象', () => {
    expect(watch()).toHaveProperty('value')
    expect(watch('a')).toHaveProperty('a')
    expect(watch('a', { a: 0 }).a).toEqual(0)
    expect(watch('a', { b: 1 }).b).toEqual(1)
  })

  it('run 运行副作用函数', () => {
    const test = watch()
    test.value = 0

    let count = 0
    function noEffect() {
      count++
    }
    function effect() {
      count++
      // eslint-disable-next-line no-unused-expressions
      test.value // 订阅effect
    }
    function effect1(a: number) {
      count += a
      // eslint-disable-next-line no-unused-expressions
      test.value // 订阅effect1
    }
    run(noEffect)
    run(effect)
    run(effect1, null, [1])

    let value = 3
    while (value--) {
      test.value++
    }
    expect(count).toBe(9)
    expect(test.value).toBe(3)
  })

  it('unWatch (添加多个订阅并)取消订阅', () => {
    const test = watch()
    test.value = 0

    function update() {
      let value = 3
      while (value--) {
        test.value++
      }
    }

    let count = 0
    function effect1() {
      run(effect2) // 仅订阅effect2
      // eslint-disable-next-line no-unused-expressions
      test.value // 订阅effect1

      if (count++ > 3) {
        unWatch(test, 'value', effect1)
        update()
      }
    }
    function effect2() {
      // eslint-disable-next-line no-unused-expressions
      test.value // 订阅effect2
      count++
    }

    run(effect1)
    update()

    expect(count).toBe(5)
    expect(test.value).toBe(3)
  })
})
