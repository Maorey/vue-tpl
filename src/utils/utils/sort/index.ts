/*
 * @Description: 排序, 兼顾内存、效率与稳定
 *   桶排序 + 基础类型(数字/字符串):快速排序 / 非基础类型:归并排序
 * @Author: 毛瑞
 * @Date: 2019-07-19 10:52:16
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-19 16:47:34
 */

import mergeSort from './merge' // 归并排序

/** 排序比较方法
 * @param {Any} a 待比较的值之一
 * @param {Any} b 待比较的值之二
 *
 * @returns {Number | Boolean | null | undefined} true/大于0数字: a在b后; 其它: a在b前
 */
type Compare = (a: any, b: any) => number | boolean | null | undefined
/** 升序
 */
const ASC: Compare = (a: any, b: any): boolean => a > b

/** 排序
 * @param {Array} array 待排序数组
 * @param {Compare} compare 排序比较方法
 */
function sort(array: any[], compare: Compare = ASC): any[] {
  if (array.length < 2) {
    return array
  }

  return array
}

export { sort as default, Compare }
