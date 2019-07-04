/*
 * @description: 撤销重做【单例】
 * @Author: 毛瑞
 * @Date: 2019-01-28 13:57:42
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-04 10:48:25
 */

/** 存储池
 */
let pool: any[] = []
/** 下一个位置索引
 */
let index = 0
/** 最大记录数
 */
let maxLength = 50

/** 撤销重做【单例】
 */
const undo = {
  /** 移除当前位置之后的并添加指定项
   * @param {Object} obj 存入的对象
   */
  push(obj: any) {
    // 综合试下来 splice+shift 最优 其实都差不多
    pool.splice(index, maxLength, obj)
    pool.length > maxLength && pool.shift()
    index = pool.length
  },
  /** 前一个
   * @param {Boolean} move 是否移动指针
   */
  prev(move?: boolean) {
    return pool[index < 0 ? index : move ? --index : index - 1]
  },
  /** 后一个
   * @param {Boolean} move 是否移动指针
   */
  next(move?: boolean) {
    return pool[index < pool.length ? (move ? index++ : index) : index]
  },
  /** 重置
   */
  reset() {
    pool = []
    index = 0
  },
  /** 设置最大记录数
   * @param {Number} max
   */
  setMax(max: number) {
    maxLength = max
  },
}

export default undo
