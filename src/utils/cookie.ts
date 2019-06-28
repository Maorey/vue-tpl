/*
 * @Description: cookie 操作
 * @Author: 毛瑞
 * @Date: 2019-06-04 16:41:55
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-27 12:22:21
 */

// 参考: https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie

/** 设置cookie
 * @param {String} key 键
 * @param {String} val 值
 * @param {Number} expires 过期时间（小时）
 */
export function set(key: string, val: string, expires?: number): void {
  let str: string = encodeURIComponent(key) + '=' + encodeURIComponent(val)

  if (expires) {
    // 过期时间
    const exdate = new Date()
    exdate.setHours(exdate.getHours() + expires)

    str += ';expires=' + exdate.toUTCString()
  }

  document.cookie = str
}

// 这点内存可以花
const REG_REPLACE: RegExp = /[-.+*]/g
const REG_REPLACE_STRING: string = '\\$&'

const REG_GET_BEFORE: string = '(?:(?:^|.*;)\\s*'
const REG_GET_AFTER: string = '\\s*\\=\\s*([^;]*).*$)|^.*$'
/** 获取指定key的cookie
 * @param {String} key 键
 *
 * @returns {String} 值
 */
export const get = (key: string): string =>
  decodeURIComponent(
    document.cookie.replace(
      new RegExp(
        REG_GET_BEFORE +
          encodeURIComponent(key).replace(REG_REPLACE, REG_REPLACE_STRING) +
          REG_GET_AFTER
      ),
      '$1'
    )
  )

const REG_HAS_BEFORE: string = '(?:^|;\\s*)'
const REG_HAS_AFTER: string = '\\s*\\='
/** 是否包含指定键的cookie
 * @param {String} key 键
 *
 * @returns {Boolean}
 */
export const has = (key: string): boolean =>
  new RegExp(
    REG_HAS_BEFORE +
      encodeURIComponent(key).replace(REG_REPLACE, REG_REPLACE_STRING) +
      REG_HAS_AFTER
  ).test(document.cookie)

interface IEntry {
  key: string // 键
  value: string // 值
}
function string2Entry(str: string): IEntry {
  const strSplit: string[] = str.split('=')
  return {
    key: decodeURIComponent(strSplit[0].trim()),
    value: decodeURIComponent(strSplit[1].trim()),
  }
}
/** 获取所有cookie
 *
 * @returns {Array<Object>} 所有cookie key,value 数组
 */
export const entries = (): IEntry[] =>
  document.cookie.split(';').map(string2Entry)

const EXPIRED = '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
/** 移除指定key的cookie
 * @param {String} key 键
 */
export function remove(key: string): void {
  document.cookie = encodeURIComponent(key) + EXPIRED
}
