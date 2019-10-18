/*
 * @Description: 存储
 * @Author: 毛瑞
 * @Date: 2019-06-04 16:07:30
 */
import { IObject } from '@/types'

interface IKeyVal {
  /** 键
   */
  k: any
  /** 值
   */
  v: any
}
/** 存储池
 */
interface IPool extends IKeyVal {
  /** 使用计数
   */
  c: number
}

/** 内存存储 key/value可以任意类型
 * @test true
 *
 */
class Memory {
  /** 存储池
   */
  pool: IPool[]
  /** 最大缓存数量，默认30
   */
  protected max: number
  /** 缓存存活时间 0为永久
   */
  protected alive: number
  /** timeout队列
   */
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
  set(key: any, value: any, expires?: number) {
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
        v: setTimeout(() => this.remove(key), expires),
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

  /** 清空存储
   */
  clear() {
    // 清空timeout队列
    for (let item of this.out) {
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

/** 本地存储
 */
const STORAGE = window.localStorage
/** 提取时间戳
 */
const REG_TIMESPAN = /^(\d+)([^\d][\d\D]*)$/
/** 本地存储 (localStorage 单例)
 * @test true
 *
 */
const local = {
  /** 获取值
   * @param {String} key 存储键
   *
   * @returns {Object} key对应的值
   */
  get(key: string): IObject | undefined {
    let item = STORAGE.getItem(key)

    if (item) {
      const execArray = REG_TIMESPAN.exec(item) // 提取数据

      if (execArray) {
        if (Date.now() > parseInt(execArray[1])) {
          // 过期
          STORAGE.removeItem(key)
          return
        }

        item = execArray[2]
      }

      try {
        return JSON.parse(item)
      } catch (e) {}
    }
  },
  /** 设置值
   * @param {String} key 存储键
   * @param {Object} value 存储值
   * @param {Number|undefined} expires 过期时间(ms) undefined: 更新
   *
   * @returns {Object} value 存储值
   */
  set(key: string, value: IObject, expires?: number) {
    let str: string

    try {
      str = JSON.stringify(value)
    } catch (e) {
      return
    }
    // 加时间戳
    expires === undefined
      ? (str =
          (REG_TIMESPAN.exec(STORAGE.getItem(key) || '') || [])[1] || '' + str)
      : expires && (str = Date.now() + expires + str)

    STORAGE.setItem(key, str) // 存储

    return value
  },
  /** 移除值
   * @param {String} key 存储键
   *
   * @returns {Object} key对应值
   */
  remove(key: string): IObject | undefined {
    const value = this.get(key) // 获取值
    STORAGE.removeItem(key) // 移除存储

    return value
  },
  /** 清空存储
   */
  clear() {
    STORAGE.clear()
  },
}

export { IPool, Memory, local }
