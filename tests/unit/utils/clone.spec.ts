/*
 * @Description: 深克隆/扩展 对象/数组(不考虑原型和循环引用) 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 13:17:12
 */
import clone, { setDefault } from '@/utils/clone'

describe('@/utils/clone: 深克隆/扩展 对象/数组(不考虑原型和循环引用)', () => {
  test('clone', () => {
    const testObject = {
      a: 0,
      b: 'a',
      c: null,
      d: { a: 1, b: 'b', c: { a: 2 }, d: [{ a: 3 }, 4, [5, 'c']] },
      e: [6, 'd', null, [7, 'e'], { a: 8 }],
    }

    expect(clone()).toBe(undefined)
    expect(clone(testObject)).not.toBe(testObject)
    expect(clone(testObject).d.c).not.toBe(testObject.d.c)
    expect(clone(testObject)).toEqual(testObject)

    expect(
      clone((key: string) => key === 'd' || key === 'e', testObject)
    ).toEqual({ a: 0, b: 'a', c: null })

    expect(
      clone(
        testObject,
        1,
        'a',
        {
          a: 9,
          d: { b: 'f', c: { a: 10, b: 'g' }, e: null },
          e: [11, 'h'],
          f: { a: 12 },
          g: ['i', 'j'],
        },
        null
      )
    ).toEqual({
      a: 9,
      b: 'a',
      c: null,
      d: {
        a: 1,
        b: 'f',
        c: { a: 10, b: 'g' },
        d: [{ a: 3 }, 4, [5, 'c']],
        e: null,
      },
      e: [11, 'h', null, [7, 'e'], { a: 8 }],
      f: { a: 12 },
      g: ['i', 'j'],
    })
  })

  test('setDefault', () => {
    const defaults = {
      a: 0,
      b: 'a',
      c: null,
      d: { a: 1, b: 'b', c: { a: 2 }, d: [{ a: 3 }, 4, [5, 'c']] },
      e: [6, 'd', null, [7, 'e'], { a: 8 }],
    }
    let result = setDefault({}, defaults)
    expect(result).toEqual(defaults)
    expect(result).not.toBe(defaults)
    expect(result.d.d[0]).not.toBe(defaults.d.d[0])

    result = setDefault({ d: null }, defaults)
    expect(result).toEqual({
      a: 0,
      b: 'a',
      c: null,
      d: null,
      e: [6, 'd', null, [7, 'e'], { a: 8 }],
    })
    expect(result).not.toBe(defaults)
    expect(result.e[3]).not.toBe(defaults.e[3])
  })
})
