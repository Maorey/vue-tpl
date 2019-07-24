/*
 * @Description: 插入排序(不使用不稳定的希尔排序，不使用二分查找)
 * @Author: 毛瑞
 * @Date: 2019-07-19 17:29:55
 */

import { ASC, Compare } from './'

/** 插入排序(稳定)
 * @test true
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

  if (start < end) {
    let temp: any
    let current: any
    let pointer: number
    let anchor: number = start
    while (anchor++ < end) {
      current = array[(pointer = anchor)]
      while (
        pointer > start &&
        Number(compare((temp = array[pointer - 1]), current)) > 0
      ) {
        array[pointer--] = temp
      }
      pointer < anchor && (array[pointer] = current)
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
