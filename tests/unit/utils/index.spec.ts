/** 工具函数测试
 */
import {
  hasOwnProperty,
  getType,
  isNumber,
  isUndef,
  isNull,
  isNullish,
  isBool,
  isString,
  isObj,
  isArray,
  isObject,
  isFn,
  isEqual,
} from '@/utils'

describe('@/utils: 工具函数', () => {
  it('hasOwnProperty: 自身是否包含指定属性', () => {
    expect(hasOwnProperty(0)).toBe(false)
    const test = { test: undefined }
    expect(hasOwnProperty(test)).toBe(false)
    expect(hasOwnProperty(test, 'test')).toBe(true)
    expect(hasOwnProperty(test, 'hasOwnProperty')).toBe(false)
  })

  it('getType: 获取目标值类型', () => {
    expect(getType(NaN)).toBe('number')
    expect(getType(-1)).toBe('number')
    expect(getType()).toBe('undefined')
    expect(getType(false)).toBe('boolean')
    expect(getType('')).toBe('string')
    expect(getType(null)).toBe('null')
    expect(getType(Symbol('test'))).toBe('symbol')
    expect(getType(1n)).toBe('bigint')
    expect(getType({})).toBe('object')
    expect(getType([])).toBe('array')
    expect(getType(Object)).toBe('function')
    expect(getType(() => {})).toBe('function')
  })

  it('isNumber: 是否数字', () => {
    expect(isNumber(0)).toBe(true)
    expect(isNumber('')).toBe(false)
    expect(isNumber('0')).toBe(true)
    expect(isNumber('0', false)).toBe(false)
    expect(isNumber('a', true, true)).toBe(true)
    expect(isNumber(NaN, false, true)).toBe(true)
  })

  it('isUndef: 是否undefined', () => {
    expect(isUndef()).toBe(true)
    expect(isUndef(null)).toBe(false)
  })

  it('isNull: 是否null', () => {
    expect(isNull()).toBe(false)
    expect(isNull(null)).toBe(true)
  })

  it('isNullish: 是否null/undefined', () => {
    expect(isNullish()).toBe(true)
    expect(isNullish(null)).toBe(true)
    expect(isNullish(0)).toBe(false)
  })

  it('isBool: 是否布尔值', () => {
    expect(isBool()).toBe(false)
    expect(isBool(true)).toBe(true)
    expect(isBool(false)).toBe(true)
  })

  it('isString: 是否字符串', () => {
    expect(isString()).toBe(false)
    expect(isString('')).toBe(true)
  })

  it('isObj: 是否数组/对象', () => {
    expect(isObj()).toBe(false)
    expect(isObj([])).toBe(true)
    expect(isObj({})).toBe(true)
  })

  it('isArray: 是否数组', () => {
    expect(isArray()).toBe(false)
    expect(isArray([])).toBe(true)
    expect(isArray({})).toBe(false)
  })

  it('isObject: 是否对象', () => {
    expect(isObject()).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isObject({})).toBe(true)
  })

  it('isFn: 是否函数', () => {
    expect(isFn()).toBe(false)
    expect(isFn([])).toBe(false)
    expect(isFn(Object)).toBe(true)
  })

  it('isEqual: 两个值是否相等', () => {
    expect(isEqual()).toBe(true)
    expect(isEqual(0)).toBe(false)
    expect(isEqual(0, '')).toBe(false)
    expect(isEqual(NaN, NaN)).toBe(true)
    expect(isEqual(Object, Object)).toBe(true)
    expect(isEqual({}, {})).toBe(true)
    expect(isEqual({ a: 0 }, { a: '0' })).toBe(false)
    expect(isEqual({ test: undefined, a: 0 }, { a: 0 })).toBe(true)
    expect(isEqual({ a: 0, b: { c: [0] } }, { a: 0, b: { c: 0 } })).toBe(false)
    expect(isEqual({ a: 0, b: { c: [0] } }, { a: 0, b: { c: [0] } })).toBe(true)
    expect(isEqual([], [])).toBe(true)
    expect(isEqual([0, 1, 2, 3], [0, 1, 2, 3, 4, 5, 6])).toBe(false)
    expect(
      isEqual([0, { a: { b: '' } }, NaN], [0, { a: { b: '' } }, NaN])
    ).toBe(true)
  })
})
