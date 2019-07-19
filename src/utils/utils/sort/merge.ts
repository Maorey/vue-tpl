/*
 * @Description: 归并排序
 *  see: https://www.cnblogs.com/eniac12/p/5329396.html#s4
 * @Author: 毛瑞
 * @Date: 2019-07-19 10:53:34
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-19 21:04:56
 */

import { ASC, Compare } from './'

/** 合并原数组上连续的两个有序数组(比如:[1,3,5,7,9,0,2,4,6,8])
 *    使用Array.prototype.splice、Array.prototype.unshift 【平均耗时为merge的5倍左右】
 * @deprecated
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数组比较方法
 * @param {Number} left 第一个数组起始索引
 * @param {Number} middle 第一个数组结束索引
 * @param {Number} right 第二个数组结束索引
 */
function mergeSp(
  array: any[],
  compare: Compare,
  left: number,
  middle: number,
  right: number
): void {
  middle++ // 第二个数组起始索引
  let temp
  while (left < right) {
    temp = array[middle]
    array.splice(middle++, 1)
    if (Number(compare(array[left], temp)) > 0) {
      // j在i前
      left ? array.splice(left - 1, 0, temp) : array.unshift(temp)
    } else {
      // j在i后 保持相对顺序不变
      array.splice(++left, 0, temp)
    }
    left++
  }
}
/** 合并原数组上连续的两个有序数组(比如:[1,3,5,7,9,0,2,4,6,8] 借助辅助数组)
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数组比较方法
 * @param {Number} left 第一个数组起始索引
 * @param {Number} middle 第一个数组结束索引
 * @param {Number} right 第二个数组结束索引
 */
function merge(
  array: any[],
  compare: Compare,
  left: number,
  middle: number,
  right: number
): void {
  const temp: any[] = array.slice(middle + 1, right + 1) // 辅助空间(第二个数组)

  let i: number = middle // 第一个数组结束索引
  let j: number = temp.length - 1 // 第二个数组结束索引
  while (i >= left && j >= 0) {
    array[right--] =
      Number(compare(array[i], temp[j])) > 0 ? array[i--] : temp[j--]
  }
  while (i >= left) {
    array[right--] = array[i--]
  }
  while (j >= 0) {
    array[right--] = temp[j--]
  }
}
/** 归并排序（迭代非递归）
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数组比较方法
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 *
 * @returns {Array} 原数组
 */
function mergeSort(
  array: any[],
  compare: Compare = ASC,
  start?: number,
  end?: number
): any[] {
  end === undefined && (end = array.length - 1)
  if (end < 1) {
    return array
  }
  start === undefined && (start = 0)

  // 子数组索引 前一个为[left, ..., middle]，后一个为[middle + 1, ..., right]
  let left: number
  let middle: number
  let right: number

  let size: number = 1 // 子数组的大小
  while (size < end) {
    left = start
    // tslint:disable-next-line: no-conditional-assignment
    while ((middle = left + size - 1) < end) {
      // 后一个子数组存在(需要归并)
      right = Math.min(middle + size, end)
      merge(array, compare, left, middle, right)
      left = right + 1 // 前一个子数组索引向后移动
    }
    // tslint:disable-next-line: no-bitwise
    size <<= 1 // 每轮翻倍(*2)
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
// mergeSort(testArray)
// console.timeEnd('cost')
// // cost: 9ms
// console.time('cost')
// mergeSort(testArray, (a: number, b: number): boolean => a < b)
// console.timeEnd('cost')
// // cost: 15ms

export default mergeSort
