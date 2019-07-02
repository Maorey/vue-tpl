/*
 * @Description: 深克隆/扩展 对象/数组(无其他原型和循环引用) 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 13:17:12
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-02 14:23:25
 */
import clone from '@/utils/utils/clone'

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
    clone(
      (
        key?: string, // 待拷贝属性
        valueValue?: any, // 目标值
        currentValue?: any, // 当前值
        currentObject?: any[] | object, // 当前对象
        targetObject?: any[] | object, // 目标对象
        args?: any[] // 当前函数参数列表（注意递归）
      ) => (key === 'd' || key === 'e') && { jump: true },
      testObject
    )
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
