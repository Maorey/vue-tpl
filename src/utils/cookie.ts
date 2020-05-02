/*
 * @Description: cookie 操作
 * @Author: 毛瑞
 * @Date: 2019-06-04 16:41:55
 */

// 参考: https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie

/** 设置cookie
 * @test true
 *
 * @param {String} key 键
 * @param {String} val 值
 * @param {Number} expires 过期时间（小时）
 */
function set(key: string, val: string, expires?: number) {
  let str = encodeURIComponent(key) + '=' + encodeURIComponent(val)

  if (expires) {
    // 过期时间
    const exdate = new Date()
    exdate.setHours(exdate.getHours() + expires)

    str += ';expires=' + exdate.toUTCString()
  }

  document.cookie = str
}

const REG_REPLACE = /[-.+*]/g
const REG_REPLACE_STRING = '\\$&'
const REG_GET_BEFORE = '(?:(?:^|.*;)\\s*'
const REG_GET_AFTER = '\\s*\\=\\s*([^;]*).*$)|^.*$'
/** 获取指定key的cookie
 * @test true
 *
 * @param {String} key 键
 *
 * @returns {String} 值
 */
function get(key: string) {
  return decodeURIComponent(
    document.cookie.replace(
      new RegExp(
        REG_GET_BEFORE +
          encodeURIComponent(key).replace(REG_REPLACE, REG_REPLACE_STRING) +
          REG_GET_AFTER
      ),
      '$1'
    )
  )
}

const REG_HAS_BEFORE = '(?:^|;\\s*)'
const REG_HAS_AFTER = '\\s*\\='
/** 是否包含指定键的cookie
 * @test true
 *
 * @param {String} key 键
 *
 * @returns {Boolean}
 */
function has(key: string) {
  return new RegExp(
    REG_HAS_BEFORE +
      encodeURIComponent(key).replace(REG_REPLACE, REG_REPLACE_STRING) +
      REG_HAS_AFTER
  ).test(document.cookie)
}

/** Cookie 键值对 */
export interface IEntry {
  /** 键 */
  k: string
  /** 值 */
  v: string
}
function stringToEntry(str: string): IEntry {
  const strSplit = str.split('=')

  return {
    k: decodeURIComponent(strSplit[0].trim()),
    v: decodeURIComponent(strSplit[1].trim()),
  }
}
/** 获取所有cookie
 * @test true
 *
 * @returns {Array<Object>} 所有cookie key,value 数组
 */
function entries(): IEntry[] {
  return document.cookie.split(';').map(stringToEntry)
}

const EXPIRED = '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
/** 移除指定key的cookie
 * @test true
 *
 * @param {String} key 键
 */
function remove(key: string) {
  document.cookie = encodeURIComponent(key) + EXPIRED
}

export { get, set, has, entries, remove }
