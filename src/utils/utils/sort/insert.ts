/*
 * @Description: 插入排序(不使用不稳定的希尔排序，不使用二分查找)
 * @Author: 毛瑞
 * @Date: 2019-07-19 17:29:55
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-19 21:02:41
 */

import { ASC, Compare } from './'

/** 插入排序
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数组比较方法
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 *
 * @returns {Array} 原数组
 */
function insertSort(
  array: any[],
  compare: Compare = ASC,
  start?: number,
  end?: number
): any[] {
  start === undefined && (start = 0)
  end === undefined && (end = array.length - 1)

  let i: number = start
  let j: number
  let elementI: any
  let elementJ: any
  while (i < end) {
    j = ++i
    elementJ = array[j]
    while (j > start) {
      elementI = array[j - 1]
      if (Number(compare(elementI, elementJ)) > 0) {
        array[j--] = elementI
      } else {
        array[j] = elementJ
        break
      }
    }
  }

  return array
}

/// 耗时 ///
// const testArray: number[] = []
// let end: number = 10000
// while (end--) {
//   testArray.push(Math.random() * end)
// }
// end = testArray.length - 1

// console.time('cost')
// insertSort(testArray)
// console.timeEnd('cost')
// // cost: 86ms
// console.time('cost')
// insertSort(testArray, (a: number, b: number): boolean => a < b)
// console.timeEnd('cost')
// // cost: 波动很大(6ms ~ 900ms) 不造为啥

export default insertSort
