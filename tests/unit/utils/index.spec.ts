/** 工具函数测试
 */
import {
  hasOwnProperty,
  getType,
  isUndef,
  isNull,
  isNullish,
  isBool,
  isNumber,
  isBigInt,
  isString,
  isSymbol,
  isObj,
  isObject,
  isArray,
  isFn,
  isEqual,
} from '@/utils'

describe('@/utils: 工具函数', () => {
  it('hasOwnProperty: 对象自身是否存在指定属性', () => {
    expect(hasOwnProperty(0)).toBe(false)
    const test = { test: undefined }
    expect(hasOwnProperty(test)).toBe(false)
    expect(hasOwnProperty(test, 'test')).toBe(true)
    expect(hasOwnProperty(test, 'hasOwnProperty')).toBe(false)
  })

  it('getType: 获取精确类型', () => {
    expect(getType(NaN)).toBe('number')
    expect(getType(-0)).toBe('number')
    expect(getType()).toBe('undefined')
    expect(getType(true)).toBe('boolean')
    expect(getType('')).toBe('string')
    expect(getType(null)).toBe('null')
    expect(getType(Symbol('test'))).toBe('symbol')
    expect(getType(1n)).toBe('bigint')
    expect(getType({})).toBe('object')
    expect(getType([])).toBe('array')
    expect(getType(() => 0)).toBe('function')
    expect(getType(Object)).toBe('function')
    expect(getType(/test/)).toBe('regexp')
    expect(getType(Math)).toBe('math')
    // ...
  })

  it('isUndef', () => {
    expect(isUndef()).toBe(true)
    expect(isUndef(null)).toBe(false)
  })

  it('isNull', () => {
    expect(isNull()).toBe(false)
    expect(isNull(null)).toBe(true)
  })

  it('isNullish', () => {
    expect(isNullish()).toBe(true)
    expect(isNullish(null)).toBe(true)
    expect(isNullish(0)).toBe(false)
  })

  it('isBool', () => {
    expect(isBool()).toBe(false)
    expect(isBool(true)).toBe(true)
    expect(isBool(false)).toBe(true)
  })

  it('isNumber', () => {
    expect(isNumber()).toBe(false)
    expect(isNumber(NaN)).toBe(true)
    expect(isNumber(0)).toBe(true)
    expect(isNumber('0')).toBe(false)
  })

  it('isBigInt', () => {
    expect(isBigInt()).toBe(false)
    expect(isBigInt(0)).toBe(false)
    expect(isBigInt(0n)).toBe(true)
  })

  it('isString', () => {
    expect(isString()).toBe(false)
    expect(isString('')).toBe(true)
  })

  it('isSymbol', () => {
    expect(isSymbol()).toBe(false)
    expect(isSymbol(Symbol)).toBe(false)
    expect(isSymbol(Symbol('test'))).toBe(true)
    expect(isSymbol(Symbol.iterator)).toBe(true)
  })

  it('isObj', () => {
    expect(isObj()).toBe(false)
    expect(isObj([])).toBe(true)
    expect(isObj({})).toBe(true)
    expect(isObj(Math)).toBe(true)
  })

  it('isObject', () => {
    expect(isObject()).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isObject(/test/)).toBe(false)
    expect(isObject({})).toBe(true)
  })

  it('isArray: 是否数组', function() {
    expect(isArray()).toBe(false)
    expect(isArray({})).toBe(false)
    expect(isArray({ 0: 0, 1: 1, length: 2 })).toBe(false)
    expect(isArray(arguments)).toBe(false)
    expect(isArray([])).toBe(true)
  })

  it('isFn: 是否函数', () => {
    expect(isFn()).toBe(false)
    expect(isFn([])).toBe(false)
    expect(isFn(Object)).toBe(true)
    expect(isFn(() => 0)).toBe(true)
  })

  it('isEqual: 比较两个值是否相等', () => {
    expect(isEqual()).toBe(true)
    expect(isEqual('')).toBe(false)
    expect(isEqual('', 0)).toBe(false)
    expect(isEqual(0, 0)).toBe(true)
    expect(isEqual(0, -0)).toBe(false)
    expect(isEqual(NaN, NaN)).toBe(true)
    expect(isEqual(1n, 1)).toBe(false)
    expect(isEqual(1n, 1n)).toBe(true)
    expect(isEqual(true)).toBe(false)
    expect(isEqual(false, false)).toBe(true)
    expect(isEqual('test', 'test')).toBe(true)
    expect(isEqual(Symbol('test'), Symbol('test'))).toBe(false)
    expect(isEqual(Symbol.iterator, Symbol.iterator)).toBe(true)
    expect(isEqual({}, {})).toBe(true)
    expect(isEqual({ a: 0 }, { a: '0' })).toBe(false)
    expect(isEqual({ a: 0 }, { a: 0, b: 1 })).toBe(false)
    expect(isEqual({ a: 0, b: 1 }, { a: 0 })).toBe(false)
    expect(isEqual({ a: 0, b: undefined }, { a: 0 })).toBe(true)
    expect(isEqual({ a: 0, b: { c: [0] } }, { a: 0, b: { c: 0 } })).toBe(false)
    expect(isEqual({ a: 0, b: { c: [0] } }, { a: 0, b: { c: [0] } })).toBe(true)
    expect(isEqual([], [])).toBe(true)
    expect(isEqual([0], [0, 1])).toBe(false)
    expect(isEqual([0, 1], [0])).toBe(false)
    expect(isEqual([0, 1], [0, 2])).toBe(false)
    expect(
      isEqual([0, { a: { b: '' } }, NaN], [0, { a: { b: '' } }, NaN])
    ).toBe(true)
    const re = /t/ig
    expect(isEqual(/t/i, re)).toBe(false)
    expect(isEqual(/t/ig, re)).toBe(true)
    re.exec('tit')
    expect(isEqual(/t/ig, re)).toBe(false)
    re.exec('tit')
    re.exec('tit')
    expect(isEqual(/t/ig, re)).toBe(true)
  })
})
