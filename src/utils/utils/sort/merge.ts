/*
 * @Description: 归并排序
 *  see: https://www.cnblogs.com/eniac12/p/5329396.html#s4
 * @Author: 毛瑞
 * @Date: 2019-07-19 10:53:34
 */

import { ASC, Compare } from './'

// 将这些变量放入执行上下文
/** 待排序数组
 */
let LIST: any[]
/** 数组元素比较方法
 */
let contrast: Compare

/** 用于释放引用
 */
const empty: any = null

// /** 使用插入排序阈值
//  * @deprecated
//  */
// const CUTOFF: number = 8
// /** 插入排序(稳定)
//  * @deprecated
//  * @param {Number} start 数组起始索引（含）
//  * @param {Number} end 数组结束索引（含）
//  */
// function insertSort(start: number, end: number): void {
//   let temp: any
//   let current: any
//   let pointer: number
//   let anchor: number = start
//   while (anchor++ < end) {
//     current = LIST[(pointer = anchor)]
//     while (
//       pointer > start &&
//       Number(contrast((temp = LIST[pointer - 1]), current)) > 0
//     ) {
//       LIST[pointer--] = temp
//     }
//     pointer < anchor && (LIST[pointer] = current)
//   }
// }

// /** 合并原数组上连续的两个有序数组(比如:[1,3,5,7,9,0,2,4,6,8])
//  *    使用Array.prototype.splice、Array.prototype.unshift 【平均耗时为merge的5倍左右】
//  * @deprecated
//  * @param {Number} left 第一个数组起始索引
//  * @param {Number} middle 第一个数组结束索引
//  * @param {Number} right 第二个数组结束索引
//  */
// function mergeSp(left: number, middle: number, right: number): void {
//   middle++ // 第二个数组起始索引
//   let temp
//   while (left < right) {
//     temp = LIST[middle]
//     LIST.splice(middle++, 1)
//     if (Number(contrast(LIST[left], temp)) > 0) {
//       // j在i前
//       left ? LIST.splice(left - 1, 0, temp) : LIST.unshift(temp)
//     } else {
//       // j在i后 保持相对顺序不变
//       LIST.splice(++left, 0, temp)
//     }
//     left++
//   }
// }
/** 合并原数组上连续的两个有序数组(比如:[1,3,5,7,9,0,2,4,6,8] 借助辅助数组)
 * @param {Number} left 第一个数组起始索引
 * @param {Number} middle 第一个数组结束索引
 * @param {Number} right 第二个数组结束索引
 */
function merge(left: number, middle: number, right: number): void {
  // // 尽量减小辅助数组大小【耗时会略增加，为啥】
  // while (right > middle) {
  //   if (Number(contrast(LIST[middle], LIST[right])) > 0) {
  //     break
  //   }
  //   right--
  // }
  // if (right > middle) {
  //   LIST[right--] = LIST[middle--] // ↓↓ ...
  const temp: any[] = LIST.slice(middle + 1, right + 1) // 辅助数组(slice比较快就不复用数组了)
  let index: number = temp.length - 1 // 辅助数组结束索引

  while (middle >= left && index >= 0) {
    LIST[right--] =
      Number(contrast(LIST[middle], temp[index])) > 0
        ? LIST[middle--]
        : temp[index--]
  }
  while (index >= 0) {
    LIST[right--] = temp[index--]
  }
}
/** 归并排序(稳定 迭代非递归)
 * @test true
 *
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数值比较方法
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
  start === undefined && (start = 0)
  end === undefined && (end = array.length - 1)

  if (end > start) {
    LIST = array
    contrast = compare

    // 子数组索引 前一个为[left, ..., middle]，后一个为[middle + 1, ..., right]
    let left: number
    let middle: number
    let right: number

    let size: number = 1 // 子数组的大小 【那么2/4/8...归并就是最高效的了】
    do {
      left = start
      // tslint:disable-next-line: no-conditional-assignment
      while ((middle = left + size - 1) < end) {
        // 【并不能减少耗时，哪怕只是二者交换，又是为啥?】
        // if (right - left < CUTOFF) {
        //   insertSort(left, right)
        // } else {
        // if (size === 1) {
        //   Number(contrast(LIST[left], LIST[++middle])) > 0 &&
        //     ([LIST[left], LIST[middle]] = [LIST[middle], LIST[left]])
        //   left = middle + 1
        // } else {
        right = middle + size
        right > end && (right = end) // 比Math.min快
        merge(left, middle, right) // 归并
        left = right + 1
      }
      // tslint:disable-next-line: no-bitwise
      size <<= 1 // 每轮翻倍(*2)
    } while (size < end)
    left > end || merge(0, left - 1, end) // 末尾捡漏

    LIST = contrast = empty // 释放引用
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
// mergeSort(testArray)
// console.timeEnd('cost')
// // cost: 8ms
// console.time('cost')
// mergeSort(testArray)
// console.timeEnd('cost')
// // cost: 3.5ms
// console.time('cost')
// mergeSort(testArray, (a: number, b: number): boolean => a < b)
// console.timeEnd('cost')
// // cost: 14ms
// console.time('cost')
// mergeSort(testArray, (): boolean => Math.random() > 0.5)
// console.timeEnd('cost')
// // cost: 12ms

export default mergeSort
