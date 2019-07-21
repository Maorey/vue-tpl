/*
 * @Description: 插入排序(不使用不稳定的希尔排序，不使用二分查找)
 * @Author: 毛瑞
 * @Date: 2019-07-19 17:29:55
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-21 22:28:36
 */

import { ASC, Compare } from './'

/** 插入排序(稳定)
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数值比较方法
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

  if (end > start) {
    let i: number = start
    let j: number
    let elementI: any
    let elementJ: any
    while (i++ < end) {
      elementJ = array[(j = i)]
      while (
        j > start &&
        Number(compare((elementI = array[j - 1]), elementJ)) > 0
      ) {
        array[j--] = elementI
      }
      j < i && (array[j] = elementJ)
    }
  }

  return array
}

/// 耗时 ///
// const testArray: number[] = []
// let last: number = 10000
// while (last--) {
//   testArray.push(Math.random() * last)
// }

// console.time('cost')
// insertSort(testArray)
// console.timeEnd('cost')
// // cost: 66ms
// console.time('cost')
// insertSort(testArray)
// console.timeEnd('cost')
// // cost: 2ms
// console.time('cost')
// insertSort(testArray, (a: number, b: number): boolean => a < b)
// console.timeEnd('cost')
// // cost: 780ms ┐(：´ゞ｀)┌
// console.time('cost')
// insertSort(testArray, (): boolean => Math.random() > 0.5)
// console.timeEnd('cost')
// // cost: 6ms 不够乱

export default insertSort
