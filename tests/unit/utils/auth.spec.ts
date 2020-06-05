/** 基于位操作的权限设计 测试
 */
import { add, toggle, del, fit, has } from '@/utils/auth'

describe('@/utils/auth: 基于位操作的权限设计', () => {
  const auth0 = 1 // >> 1 // Math.pow(2, 0)
  const auth1 = 2 // << 0 // Math.pow(2, 1)
  const auth2 = 2 << 14 // Math.pow(2, 15)
  const auth3 = 2 << 29 // Math.pow(2, 30)

  it('add: 授权', () => {
    const auth4 = add(0, [auth1, auth2])
    const auth = add(auth4, auth3)

    expect(fit(auth, auth0)).toBe(false)
    expect(fit(auth, [auth1, auth2, auth3])).toBe(true)
    expect(fit(auth, auth4)).toBe(true)
  })

  it('toggle: 切换指定权限（数组）', () => {
    const auth4 = add(0, [auth1, auth2])
    let auth = add(auth4, auth3)

    auth = toggle(auth, [auth1, auth3])
    expect(fit(auth, auth0)).toBe(false)
    expect(fit(auth, auth2)).toBe(true)
    expect(has(auth, [auth1, auth3, auth4])).toBe(false)

    auth = toggle(auth, auth4)
    expect(fit(auth, auth0)).toBe(false)
    expect(fit(auth, auth1)).toBe(true)
    expect(has(auth, [auth2, auth3, auth4])).toBe(false)
  })

  it('del: 删除指定权限（数组）', () => {
    const auth4 = add(0, [auth1, auth2])
    let auth = add(auth4, auth3)

    auth = del(auth, [auth1, auth3])
    expect(fit(auth, auth0)).toBe(false)
    expect(fit(auth, auth2)).toBe(true)
    expect(has(auth, [auth1, auth3, auth4])).toBe(false)

    auth = del(auth, auth4)
    expect(fit(auth, auth0)).toBe(false)
    expect(has(auth, [auth1, auth2, auth3, auth4])).toBe(false)
  })

  it('fit: 是否满足（全部）指定权限', () => {
    const auth4 = add(0, [auth1, auth2])
    const auth = add(auth4, auth3)

    expect(fit(auth, auth0)).toBe(false)
    expect(fit(auth, auth1)).toBe(true)
    expect(fit(auth, [auth0, auth1])).toBe(false)
    expect(fit(auth, [auth2, auth3, auth4])).toBe(true)
  })

  it('has: 是否包含指定权限（之一）', () => {
    const auth4 = add(0, [auth1, auth2])
    const auth = add(auth4, auth3)

    expect(has(auth, auth0)).toBe(false)
    expect(has(auth, auth1)).toBe(true)
    expect(has(auth, [auth0, auth1])).toBe(true)
    expect(has(auth, [auth2, auth3, auth4])).toBe(true)
  })
})
