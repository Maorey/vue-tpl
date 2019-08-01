/*
 * @Description: 排序 基础类型(数字/字符串):快速排序 非基础类型:归并排序(稳定)
 *  【重要】 排序使用compare时，a的下标一定要小于b
 * @Author: 毛瑞
 * @Date: 2019-07-19 10:52:16
 */

import mergeSort from './merge' // 归并排序
import quickSort from './quick' // 快速排序

/** 排序比较方法
 * @param {Any} a 待比较的值之一
 * @param {Any} b 待比较的值之二
 *
 * @returns {Number | Boolean | null | undefined} true/大于0数字: a在b后; 其它: a在b前
 */
type Compare = (a: any, b: any) => number | boolean | null | undefined

/** 升序
 */
const ASC: Compare = (a: any, b: any): any => a > b
// const ASC: Compare = (a: any, b: any): 0 | boolean => (a === b ? 0 : a > b)

/** 目标值是否基础类型
 * @param {Any} value 目标值
 *
 * @returns {Boolean} 是否基础类型
 */
function isBaseType(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    value.constructor === Number ||
    value.constructor === String ||
    value.constructor === Boolean
    // typeof value === 'symbol' // 不能类型转换和比较大小（只能 === 或 == ）
  )
}

/** 排序 基础类型(数字/字符串):快速排序 非基础类型:归并排序(稳定)
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数值比较方法
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 *
 * #param {Boolean} reverse 数值相等时: true:颠倒相对顺序 undefined:保留相对顺序 false: 任意
 *
 * @returns {Array} 原数组
 */
function sort(
  array: any[],
  compare: Compare = ASC,
  start?: number,
  end?: number
): any[] {
  start === undefined && (start = 0)
  end === undefined && (end = array.length - 1)

  if (end > start) {
    // 判断首尾元素类型
    if (isBaseType(array[start]) && isBaseType(array[end])) {
      return quickSort(array, compare, start, end)
    }
    // TODO: 归并/分治 + 插入
    return mergeSort(array, compare, start, end)
  }

  return array
}

export { mergeSort as default, ASC, Compare }
