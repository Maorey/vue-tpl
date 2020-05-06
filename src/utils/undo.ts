/*
 * @description: 撤销重做
 * @Author: 毛瑞
 * @Date: 2019-01-28 13:57:42
 */
/** 撤销重做 */
export default class <T = any> {
  /** 下一个位置索引 */
  private i = 0
  /** 最大记录数 */
  private max!: number
  /** 存储池 */
  private pool: T[] = []

  /**
   * @param max 最大记录数[默认50]
   */
  constructor(max?: number) {
    this.max = max || 50
  }

  /** 移除当前位置之后的并添加指定项
   * @param {Object} obj 存入的对象
   */
  push(obj: T) {
    const max = this.max
    const pool = this.pool

    // 综合试下来 splice+shift 最优 其实都差不多
    pool.splice(this.i, max, obj)
    pool.length > max && pool.shift()
    this.i = pool.length
  }

  /** 前一个
   * @param {Boolean} move 是否移动指针
   */
  prev(move?: boolean) {
    const index = this.i
    return this.pool[index < 0 ? index : move ? --this.i : index - 1]
  }

  /** 后一个
   * @param {Boolean} move 是否移动指针
   */
  next(move?: boolean) {
    const index = this.i
    const pool = this.pool
    return pool[index < pool.length ? (move ? this.i++ : index) : index]
  }

  /** 重置 */
  reset() {
    this.pool = []
    this.i = 0
  }

  /** 设置最大记录数
   * @param {Number} max
   */
  setMax(max: number) {
    this.max = max
  }
}
