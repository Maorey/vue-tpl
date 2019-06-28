/*
 * @Description: 存储 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 11:57:46
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-27 16:39:01
 */
import { Memory, local } from '@/utils/storage'

const notExits: string = 'notExits'

const memory = new Memory()
const testKey = 'test'
const testKey1 = 'test1'
const testValue = { test: testKey }
const testValue1 = { test1: testKey1 }

test('Memory api', () => {
  expect(memory.set(testKey, testValue1)).toBe(testValue1)
  expect(memory.set(testKey, testValue)).toBe(testValue)

  expect(memory.get(testKey)).toBe(testValue)
  expect(memory.get(notExits)).toBe(undefined)

  expect(memory.remove(testKey)).toBe(testValue)
  expect(memory.get(testKey)).toBe(undefined)

  memory.set(testKey, testValue)
  memory.set(testKey1, testValue1)
  memory.clear()
  expect(memory.pool.length).toBe(0)
})
test('Memory not expired', (done: () => void) => {
  memory.set(testKey, testValue, 2)

  setTimeout(() => {
    expect(memory.get(testKey)).toBe(testValue)
    done()
  })
})
test('Memory expired', (done: () => void) => {
  memory.set(testKey1, testValue1, 2)

  setTimeout(() => {
    expect(memory.get(testKey)).toBe(undefined)
    done()
  }, 2)
})

test('local api', () => {
  expect(local.set(testKey, testValue1)).toBe(testValue1)
  expect(local.set(testKey, testValue)).toBe(testValue)

  expect(local.get(testKey)).toEqual(testValue)
  expect(local.get(notExits)).toBe(undefined)

  expect(local.remove(testKey)).toEqual(testValue)
  expect(local.get(testKey)).toBe(undefined)

  local.set(testKey, testValue)
  local.set(testKey1, testValue1)
  local.clear()
  expect(local.get(testKey)).toBe(undefined)
  expect(local.get(testKey1)).toBe(undefined)
})
test('local not expired', (done: () => void) => {
  local.set(testKey, testValue, 2)

  setTimeout(() => {
    expect(local.get(testKey)).toEqual(testValue)
    done()
  })
})

test('local expired', (done: () => void) => {
  local.set(testKey1, testValue1, 2)

  setTimeout(() => {
    expect(local.get(testKey)).toBe(undefined)
    done()
  }, 2)
})
