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

  it('run 运行副作用函数', done => {
    const test = watch()
    let count = 0
    function noEffect() {
      count++
    }
    function effect() {
      count++
      return test.value
    }
    function effect1(a: number) {
      count++
      if (test.value) {
        expect(a).toBe(0)
        expect(count).toBe(5)
        expect(test.value).toBe(6)
        done()
      }
    }
    run(noEffect)
    run(effect)
    run(effect1, null, [0])

    let value = 6
    test.value = 0
    while (value--) {
      test.value++
    }
  })

  it('unWatch (添加多个订阅并)取消订阅', done => {
    const test = watch()
    function update() {
      let value = 6
      test.value = 0
      while (value--) {
        test.value++
      }
    }

    let count = 0
    function effect1() {
      count++
      run(effect2)
      test.value = 0
      if (test.value) {
        unWatch(test, 'value', effect1)
        update()
      }
    }
    function effect2() {
      count++
      if (test.value) {
        expect(count).toBe(3)
        done()
      }
    }

    run(effect1)
    update()
  })
})
