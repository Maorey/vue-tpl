/*
 * @Description: 存储 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 11:57:46
 */
import { Memory, local } from '@/utils/storage'

describe('@/utils/storage: 存储', () => {
  const notExits = 'notExits'

  const memory = new Memory()
  const testKey = 'test'
  const testKey1 = 'test1'
  const testValue = { test: testKey }
  const testValue1 = { test1: testKey1 }

  it('内存存储Class Memory.set: 存储/更新', () => {
    expect(memory.set(testKey, testValue1)).toBe(testValue1)
    expect(memory.set(testKey, testValue)).toBe(testValue)
  })
  it('内存存储Class Memory.get: 查询', () => {
    expect(memory.get(testKey)).toBe(testValue)
    expect(memory.get(notExits)).toBe(undefined)
  })
  it('内存存储Class Memory.remove: 移除', () => {
    expect(memory.remove(testKey)).toBe(testValue)
    expect(memory.get(testKey)).toBe(undefined)
  })
  it('内存存储Class Memory.clear: 清空', () => {
    memory.set(testKey, testValue)
    memory.set(testKey1, testValue1)
    memory.clear()
    expect(memory.pool.length).toBe(0)
  })
  it('内存存储Class Memory: 设置过期时间-未过期', done => {
    memory.set(testKey, testValue, 4)

    setTimeout(() => {
      expect(memory.get(testKey)).toBe(testValue)
      done()
    })
  })
  it('内存存储Class Memory: 设置过期时间-已过期', done => {
    memory.set(testKey1, testValue1, 4)

    setTimeout(() => {
      expect(memory.get(testKey)).toBe(undefined)
      done()
    }, 4)
  })

  it('本地存储 local.set: 存储/更新', () => {
    expect(local.set(testKey, testValue1)).toBe(testValue1)
    expect(local.set(testKey, testValue)).toBe(testValue)
  })
  it('本地存储 local.get: 查询', () => {
    expect(local.get(testKey)).toEqual(testValue)
    expect(local.get(notExits)).toBe(undefined)
  })
  it('本地存储 local.remove: 移除', () => {
    expect(local.remove(testKey)).toEqual(undefined)
    expect(local.get(testKey)).toBe(undefined)
  })
  it('本地存储 local.clear: 清空', () => {
    local.set(testKey, testValue)
    local.set(testKey1, testValue1)
    local.clear()
    expect(local.get(testKey)).toBe(undefined)
    expect(local.get(testKey1)).toBe(undefined)
  })
  it('本地存储 local: 设置过期时间-未过期', done => {
    local.set(testKey, testValue, 4)

    setTimeout(() => {
      expect(local.get(testKey)).toEqual(testValue)
      done()
    })
  })

  it('本地存储 local: 设置过期时间-已过期', done => {
    local.set(testKey1, testValue1, 4)

    setTimeout(() => {
      expect(local.get(testKey)).toBe(undefined)
      done()
    }, 4)
  })
})
