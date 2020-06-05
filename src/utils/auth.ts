/** 基于位操作的权限设计 权限码必须唯一且只有一位值(2^n 0 <= n <= 30) 可划分命名空间
 *    JavaScript的位运算只支持32bit数字(含符号位) 每位表示一种权限 0无权限 1有权限
 *    服务端应响应权限代码，计算方式相同，比如：{a: 0, b: 3} 或 [0, 3]
 */
import { isNumber } from '.'
/** 授权
 * @test true
 *
 * @param {Number} auth 当前拥有的权限代码
 * @param {Number|Array<Number>} items 指定权限(数组)，可以是权限代码，比如3 (2^0 + 2^1两种权限)
 *
 * @returns {Number} 当前拥有的权限代码
 */
function add(auth: number, items: number | number[]) {
  if (isNumber(items)) {
    return auth | items
  }

  let item
  for (item of items) {
    auth |= item
  }
  return auth
}

/** 切换指定权限（数组）
 * @test true
 *
 * @param {Number} auth 当前拥有的权限代码
 * @param {Number|Array<Number>} items 指定权限(数组)，可以是权限代码，比如3 (2^0 + 2^1两种权限)
 *
 * @returns {Number} 当前拥有的权限代码
 */
function toggle(auth: number, items: number | number[]) {
  if (isNumber(items)) {
    return auth ^ items
  }

  let item
  for (item of items) {
    auth ^= item
  }
  return auth
}

/** 删除指定权限（数组）
 * @test true
 *
 * @param {Number} auth 当前拥有的权限代码
 * @param {Number|Array<Number>} items 指定权限(数组)，可以是权限代码，比如3 (2^0 + 2^1两种权限)
 *
 * @returns {Number} 当前拥有的权限代码
 */
function del(auth: number, items: number | number[]) {
  if (isNumber(items)) {
    return auth & ~items
  }

  let item
  for (item of items) {
    auth &= ~item
  }
  return auth
}

/** 是否满足（全部）指定权限
 * @test true
 *
 * @param {Number} auth 当前拥有的权限代码
 * @param {Number|Array<Number>} items 指定权限(数组)，可以是权限代码，比如3 (2^0 + 2^1两种权限)
 *
 * @returns {Boolean} 是否有权限
 */
function fit(auth: number, items: number | number[]) {
  if (isNumber(items)) {
    return (auth & items) === items
  }

  let item
  for (item of items) {
    if ((auth & item) !== item) {
      return false
    }
  }
  return true
}

/** 是否包含指定权限（之一）
 * @test true
 *
 * @param {Number} auth 当前拥有的权限代码
 * @param {Number|Array<Number>} items 指定权限(数组)，可以是权限代码，比如3 (2^0 + 2^1两种权限)
 *
 * @returns {Boolean} 是否有权限
 */
function has(auth: number, items: number | number[]) {
  if (isNumber(items)) {
    return (auth & items) === items
  }

  let item
  for (item of items) {
    if ((auth & item) === item) {
      return true
    }
  }
  return false
}

export { add, toggle, del, fit, has }
