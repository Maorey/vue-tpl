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
function set(key: string, val: string, expires?: number): void {
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
 * @test true
 *
 * @param {String} key 键
 *
 * @returns {String} 值
 */
function get(key: string): string {
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

const REG_HAS_BEFORE: string = '(?:^|;\\s*)'
const REG_HAS_AFTER: string = '\\s*\\='
/** 是否包含指定键的cookie
 * @test true
 *
 * @param {String} key 键
 *
 * @returns {Boolean}
 */
function has(key: string): boolean {
  return new RegExp(
    REG_HAS_BEFORE +
      encodeURIComponent(key).replace(REG_REPLACE, REG_REPLACE_STRING) +
      REG_HAS_AFTER
  ).test(document.cookie)
}

/** Cookie 键值对
 */
interface IEntry {
  /** 键
   */
  k: string
  /** 值
   */
  v: string
}
function stringToEntry(str: string): IEntry {
  const strSplit: string[] = str.split('=')

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
function remove(key: string): void {
  document.cookie = encodeURIComponent(key) + EXPIRED
}

export { get, set, has, entries, remove, IEntry }
