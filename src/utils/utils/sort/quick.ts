/*
 * @Description: 快速排序, 交换数组索引并返回【不会被vue2监测到数组变化】
 *  参考 https://segmentfault.com/a/1190000010928302#articleHeader4
 * @Author: 毛瑞
 * @Date: 2019-06-27 13:01:27
 */

import { ASC, Compare } from '.'

/** 使用插入排序阈值
 */
const LOW: number = 6

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

/** 插入排序(稳定)
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 */
function insertSort(start: number, end: number): void {
  let temp: any
  let current: any
  let pointer: number
  let anchor: number = start
  while (anchor++ < end) {
    current = LIST[(pointer = anchor)]
    while (
      pointer > start &&
      Number(contrast((temp = LIST[pointer - 1]), current)) > 0
    ) {
      LIST[pointer--] = temp
    }
    pointer < anchor && (LIST[pointer] = current)
  }
}

/** 交换数组元素
 * @param {Number} p1
 * @param {Number} p2
 */
function swap(p1: number, p2: number): void {
  ;[LIST[p1], LIST[p2]] = [LIST[p2], LIST[p1]]
}

/** 得到基准 【左中右排序取中位数，并把中位数交换到倒数第二个】
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 *
 * @returns {Any} 基准
 */
function findPivot(start: number, end: number): any {
  // tslint:disable-next-line: no-bitwise
  const pivot: number = (start + end) >> 1

  contrast(LIST[start], LIST[pivot]) && swap(start, pivot)
  contrast(LIST[start], LIST[end]) && swap(start, end)
  contrast(LIST[pivot], LIST[end]) && swap(pivot, end)

  swap(pivot, --end) // 将基准换到右二

  return LIST[end]
}

/** 快速排序(不稳定)
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 */
function partition(start: number, end: number): void {
  if (end - start < LOW) {
    insertSort(start, end)
  } else {
    const pivot: any = findPivot(start, end)
    let left: number = start + 1
    let right: number = end - 2

    while (true) {
      // 从左边开始找到第一个比pivot大的
      while (left < right && contrast(pivot, LIST[left])) {
        left++
      }
      // 从右边开始找到第一个比pivot小的
      while (right > left && contrast(LIST[right], pivot)) {
        right--
      }

      if (left < right) {
        swap(left++, right--)
      } else {
        left === right && contrast(pivot, LIST[left]) && left++
        right = left
        break
      }
    }
    swap(left, end - 1)

    // 尾递归子序列
    --left > start && partition(start, left)
    ++right < end && partition(right, end)
  }
}

/** 快速排序(不稳定)
 * https://segmentfault.com/a/1190000010928302#articleHeader4
 * @test true
 *
 * @param {Array} LIST 待排序数组
 * @param {Function} contrast 【可选，默认升序】a > b时：返回真值则升序，返回假值则降序
 *
 * @returns {Array} LIST 排序后的原数组
 */
function quickSort(
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

    partition(start, end)

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
// quickSort(testArray)
// console.timeEnd('cost')
// // cost: 21ms
// console.time('cost')
// quickSort(testArray)
// console.timeEnd('cost')
// // cost: 0.5ms
// console.time('cost')
// quickSort(testArray, (a: number, b: number): boolean => a < b)
// console.timeEnd('cost')
// // cost: 25ms
// console.time('cost')
// quickSort(testArray, (): boolean => Math.random() > 0.5)
// console.timeEnd('cost')
// // cost: 6ms

export default quickSort
