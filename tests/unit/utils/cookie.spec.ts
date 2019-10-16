/*
 * @Description: cookie 操作测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 11:09:27
 */
import { set, has, get, entries, remove } from '@/utils/cookie'

describe('@/utils/cookie: cookie 操作', () => {
  const notExits = 'notExits'

  it('set: 存储/更新值', () => {
    expect(set('测试', '测试值')).toBe(undefined)
    expect(set('test', 'value')).toBe(undefined)
  })

  it('has: 是否存在', () => {
    expect(has('测试')).toBe(true)
    expect(has('test')).toBe(true)
    expect(has(notExits)).toBe(false)
  })

  it('get: 获取', () => {
    expect(get('测试')).toBe('测试值')
    expect(get('test')).toBe('value')
    expect(get(notExits)).toBe('')
  })

  it('entries: 获取全部', () => {
    expect(entries()).toEqual([
      { k: '测试', v: '测试值' },
      { k: 'test', v: 'value' },
    ])
  })

  it('remove: 移除', () => {
    expect(remove('test')).toBe(undefined)
    expect(remove('测试')).toBe(undefined)
    expect(remove(notExits)).toBe(undefined)

    expect(has('test')).toBe(false)
    expect(has('测试')).toBe(false)
  })

  // cookie 过期时间是小时诶，不测了吧
})
