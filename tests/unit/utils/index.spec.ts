/** 工具函数测试
 */
import {
  hasOwn,
  getType,
  is,
  isUndef,
  isNull,
  isNullish,
  isDef,
  isBool,
  isNumber,
  isBigInt,
  isString,
  isSymbol,
  isObj,
  isObject,
  isArray,
  isFn,
  isReg,
  isDate,
  isPromise,
  isEqual,
  trim,
} from '@/utils'

describe('@/utils: 工具函数', () => {
  it('hasOwn: 对象自身是否存在指定属性', () => {
    expect(hasOwn(0)).toBe(false)
    const test = { test: undefined }
    expect(hasOwn(test)).toBe(false)
    expect(hasOwn(test, 'test')).toBe(true)
    expect(hasOwn(test, 'hasOwn')).toBe(false)
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

  it('is: 是否为指定类型', () => {
    expect(is()).toBe(true)
    expect(is(undefined, 'undefined')).toBe(true)
    expect(is(null, 'object')).toBe(false)
    expect(is(null, 'null')).toBe(true)
    expect(is(null, {})).toBe(false)
    expect(is(null, null)).toBe(true)
    expect(is(NaN, 0)).toBe(true)
    expect(is(NaN, NaN)).toBe(true)
    expect(is(NaN, 'number')).toBe(true)
  })

  it('isUndef: 是否为 undefined', () => {
    expect(isUndef()).toBe(true)
    expect(isUndef(null)).toBe(false)
  })

  it('isNull: 是否为 null', () => {
    expect(isNull()).toBe(false)
    expect(isNull(null)).toBe(true)
  })

  it('isNullish: 是否为 null/undefined', () => {
    expect(isNullish()).toBe(true)
    expect(isNullish(null)).toBe(true)
    expect(isNullish(0)).toBe(false)
  })

  it('isDef: 是否[不为] null/undefined', () => {
    expect(isDef()).toBe(false)
    expect(isDef(null)).toBe(false)
    expect(isDef(0)).toBe(true)
  })

  it('isBool: 是否为 Boolean', () => {
    expect(isBool()).toBe(false)
    expect(isBool(true)).toBe(true)
    expect(isBool(false)).toBe(true)
  })

  it('isNumber: 是否为 Number', () => {
    expect(isNumber()).toBe(false)
    expect(isNumber(NaN)).toBe(true)
    expect(isNumber(0)).toBe(true)
    expect(isNumber('0')).toBe(false)
  })

  it('isBigInt: 是否为 BigInt', () => {
    expect(isBigInt()).toBe(false)
    expect(isBigInt(0)).toBe(false)
    expect(isBigInt(0n)).toBe(true)
  })

  it('isString: 是否为 String', () => {
    expect(isString()).toBe(false)
    expect(isString('')).toBe(true)
  })

  it('isSymbol: 是否为 Symbol', () => {
    expect(isSymbol()).toBe(false)
    expect(isSymbol(Symbol)).toBe(false)
    expect(isSymbol(Symbol('test'))).toBe(true)
    expect(isSymbol(Symbol.iterator)).toBe(true)
  })

  it('isObj: 是否为 Object/Array/RegExp/...', () => {
    expect(isObj()).toBe(false)
    expect(isObj([])).toBe(true)
    expect(isObj({})).toBe(true)
    expect(isObj(Math)).toBe(true)
  })

  it('isObject: 是否为 Object', () => {
    expect(isObject()).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isObject(/test/)).toBe(false)
    expect(isObject({})).toBe(true)
  })

  it('isArray: 是否为 Array', function() {
    expect(isArray()).toBe(false)
    expect(isArray({})).toBe(false)
    expect(isArray({ 0: 0, 1: 1, length: 2 })).toBe(false)
    expect(isArray(arguments)).toBe(false)
    expect(isArray([])).toBe(true)
  })

  it('isFn: 是否为 Function', () => {
    expect(isFn()).toBe(false)
    expect(isFn([])).toBe(false)
    expect(isFn(Object)).toBe(true)
    expect(isFn(() => 0)).toBe(true)
  })

  it('isReg: 是否为 RegExp', () => {
    expect(isReg()).toBe(false)
    expect(isReg([])).toBe(false)
    expect(isReg({})).toBe(false)
    expect(isReg(/test/)).toBe(true)
  })

  it('isDate: 是否为 Date', () => {
    expect(isDate()).toBe(false)
    expect(isDate([])).toBe(false)
    expect(isDate({})).toBe(false)
    expect(isDate(new Date())).toBe(true)
  })

  it('isPromise: 是否为 Promise', () => {
    expect(isPromise()).toBe(false)
    expect(isPromise([])).toBe(false)
    expect(isPromise({})).toBe(false)
    expect(isPromise(Promise)).toBe(false)
    expect(isPromise(Promise.resolve())).toBe(true)
    expect(isPromise(Promise.reject(new Error()))).toBe(true)
    expect(isPromise(new Promise(() => 0))).toBe(true)
    expect(isPromise({ then: () => 0, catch: () => 0 })).toBe(true)
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
    // const re = /t/gi
    // expect(isEqual(/t/i, re)).toBe(false)
    // expect(isEqual(/t/gi, re)).toBe(true)
    // re.exec('tit')
    // expect(isEqual(/t/gi, re)).toBe(false)
    // re.exec('tit')
    // re.exec('tit')
    // expect(isEqual(/t/gi, re)).toBe(true)
    expect(isEqual(/t/i, /t/i)).toBe(false)
    expect(isEqual(/t/i, /t/gi)).toBe(false)
    expect(isEqual({}, {}, true)).toBe(false)
  })

  it('trim: 去首尾空格(对象/数组直接修改)', () => {
    expect(trim()).toBe(undefined)
    expect(trim(undefined)).toBe(undefined)
    expect(trim(0)).toBe(0)
    expect(trim(null)).toBe(null)
    expect(trim(false)).toBe(false)
    expect(trim('')).toBe('')
    expect(trim(' ')).toBe('')
    expect(trim('  ')).toBe('')
    expect(trim('   ')).toBe('')
    expect(trim('a ')).toBe('a')
    expect(trim('  a')).toBe('a')
    expect(trim(' a   ')).toBe('a')
    expect(trim('  a a  a ')).toBe('a a  a')
    expect(trim([])).toEqual([])
    expect(trim({})).toEqual({})
    expect(trim({ a: ' a ', b: ['  a  '], c: { a: ' a ' } })).toEqual({
      a: 'a',
      b: ['a'],
      c: { a: 'a' },
    })
    expect(
      trim([
        '  ',
        ' a',
        ['a ', ' '],
        { a: ' a ', b: ['  a  '], c: { a: ' a ' } },
      ])
    ).toEqual(['', 'a', ['a', ''], { a: 'a', b: ['a'], c: { a: 'a' } }])
  })
})
