/*
 * @Description: cookie 操作测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 11:09:27
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-04 10:56:38
 */
import { set, has, get, entries, remove } from '@/utils/cookie'

const notExits = 'notExits'

test('set cookie', () => {
  expect(set('测试', '测试值')).toBe(undefined)
  expect(set('test', 'value')).toBe(undefined)
})

test('has cookie', () => {
  expect(has('测试')).toBe(true)
  expect(has('test')).toBe(true)
  expect(has(notExits)).toBe(false)
})

test('get cookie', () => {
  expect(get('测试')).toBe('测试值')
  expect(get('test')).toBe('value')
  expect(get(notExits)).toBe('')
})

test('cookie entries', () => {
  expect(entries()).toEqual([
    { k: '测试', v: '测试值' },
    { k: 'test', v: 'value' },
  ])
})

test('remove cookie', () => {
  expect(remove('test')).toBe(undefined)
  expect(remove('测试')).toBe(undefined)
  expect(remove(notExits)).toBe(undefined)

  expect(has('test')).toBe(false)
  expect(has('测试')).toBe(false)
})

// cookie 过期时间是小时诶，不测了吧
