/*
 * @Description: 存储
 * @Author: 毛瑞
 * @Date: 2019-06-04 16:07:30
 */
import { isFn, isString, isNumber, isUndef, isEqual } from '.'

/** 存储池 */
export interface IPool {
  /** 键 */
  k: any
  /** 值 */
  v: any
  /** 使用计数 */
  c: number
  /** setTimeout id */
  t?: number
}
/** 存储键比较方式 引用|值 */
export type CompareMode = 'ref' | 'value'

/** 内存存储 key/value可以任意类型
 * @test true
 */
class Memory {
  /** 存储池 */
  pool: IPool[]
  /** 最大缓存数量，默认30 */
  protected max: number
  /** 缓存存活时间 0为永久 */
  protected alive: number
  /** 是否不比较存储键的值 */
  protected noRef: boolean

  /** 构造函数
   * @param max 最大缓存数量，默认30
   * @param alive 缓存存活时间 0为永久
   * @param compareMode 存储键比较方式, 默认:比较值
   */
  constructor(max?: number, alive?: number, compareMode?: CompareMode) {
    this.pool = []
    this.noRef = compareMode === 'ref'
    this.max = (max as number) > 0 ? (max as number) : 30
    this.alive = (alive as number) > 0 ? (alive as number) : 0
  }

  /** 获取值
   * @param key 缓存关键字
   * @param operation 操作：
   *
   *  0: 仅返回IPool
   *
   *  1: 移除并返回IPool
   *
   *  其它: 返回 value | undefined 【默认】
   * @param compareMode 存储键比较方式, 默认: 构造函数指定
   */
  get<T = any>(
    key: any,
    operation?: number,
    compareMode?: CompareMode
  ): T | IPool | undefined

  /** 获取值
   * @param key 缓存关键字
   * @param compareMode 存储键比较方式, 默认: 构造函数指定
   * @param operation 操作：
   *
   *  0: 仅返回IPool
   *
   *  1: 移除并返回IPool
   *
   *  其它: 返回 value | undefined 【默认】
   */
  get<T = any>(
    key: any,
    compareMode?: CompareMode,
    operation?: number
  ): T | IPool | undefined

  get<T = any>(
    key: any,
    operation?: number | CompareMode,
    compareMode?: CompareMode | number
  ): T | IPool | undefined {
    let item
    if (isString(operation) || isNumber(compareMode)) {
      item = operation
      operation = compareMode as number | undefined
      compareMode = item as CompareMode
    }
    const pool = this.pool
    const noRef = compareMode ? compareMode === 'ref' : this.noRef
    let index = pool.length
    while (index--) {
      item = pool[index]

      if (isEqual(item.k, key, noRef)) {
        switch (operation) {
          case 0:
            return item
          case 1:
            pool.splice(index, 1)
            return item
          default:
            item.c++
        }

        return item.v
      }
    }
  }

  /** 设置值
   * @param key 存储键
   * @param value 存储值
   * @param expires 过期时间(ms)
   * @param compareMode 存储键比较方式, 默认: 构造函数指定
   *
   * @returns value 存储值
   */
  set<T = any>(
    key: any,
    value: T,
    expires?: number,
    compareMode?: CompareMode
  ): T

  /** 设置值
   * @param key 存储键
   * @param value 存储值
   * @param compareMode 存储键比较方式, 默认: 构造函数指定
   * @param expires 过期时间(ms)
   *
   * @returns value 存储值
   */
  set<T = any>(
    key: any,
    value: T,
    compareMode?: CompareMode,
    expires?: number
  ): T

  set<T = any>(
    key: any,
    value: T,
    expires?: number | CompareMode,
    compareMode?: CompareMode | number
  ): T {
    let item
    if (isString(expires) || isNumber(compareMode)) {
      item = expires
      expires = compareMode as number | undefined
      compareMode = item as CompareMode
    }
    item = this.get<IPool>(key, 0, compareMode)
    if (item) {
      if (item.t) {
        clearTimeout(item.t)
        item.t = 0
      }
      item.v = value
    } else {
      item = { k: key, v: value, c: 0 }
      this.pool.push(item) > this.max && this.elim()
    }

    ;((expires as number) >= 0
      ? (expires as number)
      : (expires = this.alive)) &&
      (item.t = setTimeout(() => {
        this.remove(key)
      }, expires))

    return value
  }

  /** 移除并返回key对应的值
   * @param key 存储键
   * @param compareMode 存储键比较方式, 默认: 构造函数指定
   *
   * @returns value 存储值 | undefined
   */
  remove<T = any>(key: any, compareMode?: CompareMode): T | undefined {
    const item = this.get<IPool>(key, 1, compareMode)
    if (item) {
      clearTimeout(item.t)
      return item.v
    }
  }

  /** 清空存储 */
  clear() {
    let item
    for (item of this.pool) {
      clearTimeout(item.t)
    }
    this.pool = []
  }

  // 去掉使用次数最低的
  protected elim() {
    const pool = this.pool
    let index = 0
    let item = pool[0]
    for (let i = 1, LEN = pool.length / 2, temp; i < LEN; i++) {
      if (!item.c) {
        break
      }

      temp = pool[i]
      if (temp.c < item.c) {
        index = i
        item = temp
      }
    }

    pool.splice(index, 1)
    clearTimeout(item.t)
  }
}

type encoder = (json: string, orgin: any) => string
type decoder = (json: string) => string
interface Setter {
  <T>(key: string, value: T, expires?: number, encoder?: encoder): T
}
interface Setter {
  <T>(key: string, value: T, encoder?: encoder, expires?: number): T
}
/** 本地存储 */
const STORAGE = window.localStorage
const ALIVE = 100 * 1000 // 防可能的内存溢出
const SEPARATOR = String.fromCharCode(9) // 0及控制字符等 IE 有问题
const REG_TIMESPAN = new RegExp(`^(\\d+)${SEPARATOR}([\\d\\D]+)$`)
let CACHE: IObject<{ k?: number; v?: any; e?: number | null } | 0> = {}
/** 本地存储 (localStorage 单例)
 * @test true
 */
const local = {
  /** 获取值
   * @param key 存储键
   * @param decoder 解码器
   *
   * @returns key对应的值, 转对象/数组失败的将返回字符串
   */
  get<T = any>(key: string, decoder?: decoder): T | string | undefined {
    let item: IObject | string | null | 0 = CACHE[key]
    if (item) {
      if (item.e && Date.now() > item.e) {
        STORAGE.removeItem(key)
        clearTimeout(item.k)
        CACHE[key] = 0
        return
      }
      return item.v
    }

    if ((item = STORAGE.getItem(key))) {
      if (decoder) {
        try {
          item = decoder(item)
        } catch (error) {
          console.error(error)
          return
        }
      }

      let execArray: string[] | null | number = REG_TIMESPAN.exec(item)
      if (execArray) {
        item = execArray[2]
        if (Date.now() > (execArray = +execArray[1])) {
          STORAGE.removeItem(key)
          return
        }
      }

      try {
        item = JSON.parse(item)
      } catch (error) {}
      CACHE[key] = {
        v: item,
        e: execArray,
        k: setTimeout(() => {
          CACHE[key] = 0
        }, ALIVE),
      }

      return item as T | string
    }
  },
  /** 设置值
   * @param key 存储键
   * @param value 存储值
   * @param expires/encoder 过期时间(ms) undefined: 更新/加密
   * @param encoder/expires 加密/过期时间(ms) undefined: 更新
   *
   * @returns value 存储值
   */
  set: function(
    key: string,
    value: any,
    expires?: number | encoder,
    encoder?: encoder | number
  ) {
    let str
    if (isFn(expires) || isNumber(encoder)) {
      str = encoder
      encoder = expires as encoder
      expires = str as number
    }

    const item = (CACHE[key] = CACHE[key] || {})
    str = JSON.stringify(value)

    if ((expires as number) >= 0) {
      expires && (str = (item.e = Date.now() + expires) + SEPARATOR + str)
    } else {
      isUndef(item.e) &&
        (item.e = +(REG_TIMESPAN.exec(STORAGE.getItem(key) as string) || '')[1])
      str = (item.e ? item.e + SEPARATOR : '') + str
    }

    if (encoder) {
      try {
        str = encoder(str, value)
      } catch (error) {
        console.error(error)
        return
      }
    }

    item.v = value
    item.k && clearTimeout(item.k)
    item.k = setTimeout(() => {
      CACHE[key] = 0
    }, ALIVE)

    STORAGE.setItem(key, str)

    return value
  } as Setter,
  /** 移除值
   * @param key 存储键
   */
  remove(key: string) {
    const item = CACHE[key]
    if (item) {
      clearTimeout(item.k)
      CACHE[key] = 0
    }
    STORAGE.removeItem(key)
  },
  /** 清空存储 */
  clear() {
    let item: string | IObject | 0
    for (item in CACHE) {
      item = CACHE[item]
      item && clearTimeout(item.k)
    }
    CACHE = {}
    STORAGE.clear()
  },
}

export { Memory, local }
