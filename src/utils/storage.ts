/*
 * @Description: 存储
 * @Author: 毛瑞
 * @Date: 2019-06-04 16:07:30
 */
import { isFn } from '.'
interface IKeyVal {
  /** 键 */
  k: any
  /** 值 */
  v: any
}
/** 存储池 */
export interface IPool extends IKeyVal {
  /** 使用计数 */
  c: number
}

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
  /** timeout队列 */
  private out: IKeyVal[]

  /** 构造函数
   * @param {Number} max 最大缓存数量，默认30
   * @param {Number} alive 缓存存活时间 0为永久
   *
   * @returns {Object} Memory实例
   */
  constructor(max = 30, alive = 0) {
    this.max = max
    this.alive = alive

    this.pool = []
    this.out = []
  }

  /** 获取值
   * @param {Any} key 缓存关键字
   * @param {Number} option 操作：
   * 0 返回{key, val}
   * 1 移除该key, 返回val
   * 其它 返回val (计引用次数)【默认】
   * @param {Array} pool 存储池
   *
   * @returns {Any} 见option
   */
  get(key: any, option?: number, pool?: IPool[] | IKeyVal[]) {
    pool || (pool = this.pool)

    // 从后往前找
    let tmp: IPool | IKeyVal
    let index = pool.length
    while (index--) {
      tmp = pool[index]

      if (tmp.k === key) {
        // 找到缓存
        switch (option) {
          case 0: // 获取kv
            return tmp
          case 1: // 移除
            pool.splice(index, 1)
            break
          default:
            ;(tmp as IPool).c++ // 计数
        }

        return tmp.v // 返回值
      }
    }
  }

  /** 设置值
   * @param {Any} key 存储键
   * @param {Any} value 存储值
   * @param {Number} expires 过期时间(ms)
   *
   * @returns {Any} val 存储值
   */
  set<T = any>(key: any, value: T, expires?: number): T {
    expires === undefined && (expires = this.alive)
    clearTimeout(this.get(key, 1, this.out)) // 先清除该key的timeout

    const tmp = this.get(key, 0) // 获取{key, val}
    if (tmp) {
      // 更新值
      tmp.v = value
    } else {
      // 添加值到末尾 && 超长处理
      this.pool.push({ k: key, v: value, c: 0 }) > this.max && this.elim()
    }

    // 设置过期时间 放末尾
    expires &&
      this.out.push({
        k: key,
        v: setTimeout(() => {
          this.remove(key)
        }, expires),
      })

    return value
  }

  /** 移除并返回key对应的值
   * @param {Any} key 存储键
   *
   * @returns {Any} key对应的val
   */
  remove(key: any) {
    clearTimeout(this.get(key, 1, this.out)) // 同时移除timeout队列

    return this.get(key, 1)
  }

  /** 清空存储 */
  clear() {
    // 清空timeout队列
    for (const item of this.out) {
      clearTimeout(item.v)
    }

    this.out = []
    this.pool = []
  }

  // 去掉使用次数最低的
  private elim() {
    const pool = this.pool

    let index = 0 // 待移除项下标
    let item = pool[0] // 待移除项

    // 只从前一半里找
    for (let i = 1, LEN = pool.length / 2, count = item.c; i < LEN; i++) {
      if (!count) {
        // 使用次数为0(没有get过)
        break
      }

      if (pool[i].c < count) {
        // 记录使用次数更少的
        index = i
        item = pool[i]
        count = item.c
      }
    }

    pool.splice(index, 1) // 移除该项
    clearTimeout(this.get(item.k, 1, this.out)) // 同时移除timeout
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
/** 提取时间戳 */
const REG_TIMESPAN = /^(\d+)([^\d][\d\D]*)$/
const ALIVE = 100 * 1000 // 防可能的内存溢出
let CACHE: IObject<{ k?: number; v?: any; e?: number | null } | 0> = {}
/** 本地存储 (localStorage 单例)
 * @test true
 */
const local = {
  /** 获取值
   * @param {String} key 存储键
   * @param {Function} decoder 解码器
   *
   * @returns {Object} key对应的值
   */
  get(key: string, decoder?: decoder) {
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
      let execArray: string[] | null | number = REG_TIMESPAN.exec(item) // 提取数据

      if (execArray) {
        item = execArray[2]
        if (Date.now() > (execArray = parseInt(execArray[1]))) {
          STORAGE.removeItem(key)
          return
        }
      }

      try {
        item = JSON.parse(item)
      } catch (error) {
        return
      }
      CACHE[key] = {
        v: item,
        e: execArray,
        k: setTimeout(() => {
          CACHE[key] = 0
        }, ALIVE),
      }
      return item
    }
  },
  /** 设置值
   * @param {String} key 存储键
   * @param {Object} value 存储值
   * @param {Number|Function} encoder/expires 加密/过期时间(ms) undefined: 更新
   * @param {Number|Function} expires/encoder 过期时间(ms) undefined: 更新/加密
   *
   * @returns {Object} value 存储值
   */
  set: function(key: string, value: any, encoder?: any, expires?: any) {
    let str
    if (!isFn(encoder)) {
      str = encoder
      encoder = expires
      expires = str
    }
    str = JSON.stringify(value)
    // 加时间戳
    const temp = (CACHE[key] = CACHE[key] || {})
    expires >= 0
      ? expires && (str = (temp.e = Date.now() + expires) + str)
      : (str =
          (temp.e ||
            (temp.e = parseInt(
              (REG_TIMESPAN.exec(STORAGE.getItem(key) || '') || [])[1]
            )) ||
            '') + str)

    if (encoder) {
      try {
        str = encoder(str, value)
      } catch (error) {
        console.error(error)
        return
      }
    }

    clearTimeout(temp.k)
    temp.v = value
    temp.k = setTimeout(() => {
      CACHE[key] = 0
    }, ALIVE)

    STORAGE.setItem(key, str)

    return value
  } as Setter,
  /** 移除值
   * @param {String} key 存储键
   */
  remove(key: string) {
    const temp = CACHE[key]
    temp && clearTimeout(temp.k)
    CACHE[key] = 0
    STORAGE.removeItem(key)
  },
  /** 清空存储 */
  clear() {
    let temp: string | IObject | 0
    for (temp in CACHE) {
      temp = CACHE[temp]
      temp && clearTimeout(temp.k)
    }
    CACHE = {}
    STORAGE.clear()
  },
}

export { Memory, local }
