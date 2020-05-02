/*
 * @Description: 插入排序(不使用不稳定的希尔排序)
 * @Author: 毛瑞
 * @Date: 2019-07-19 17:29:55
 */
import { ASC, Compare } from '.'

/** 插入排序(稳定)
 * @test true
 *
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数值比较方法
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 *
 * @returns {Array} 原数组
 */
// function insertSort<T>(
//   array: T[],
//   compare: Compare = ASC,
//   start?: number,
//   end?: number,
// ): T[] {
//   start === undefined && (start = 0)
//   end === undefined && (end = array.length - 1)

//   if (start < end) {
//     let temp: T
//     let current: T
//     let pointer: number
//     let anchor = start
//     while (anchor++ < end) {
//       current = array[(pointer = anchor)]
//       while (
//         pointer > start &&
//         +(compare((temp = array[pointer - 1]), current) as any) > 0
//       ) {
//         array[pointer--] = temp
//       }
//       pointer < anchor && (array[pointer] = current)
//     }
//   }

//   return array
// }

/// 耗时 ///
// const testArray: number[] = []
// let last = 10000
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
// insertSort(testArray, (a: number, b: number) => a < b)
// console.timeEnd('cost')
// // cost: 780ms ┐(：´ゞ｀)┌
// console.time('cost')
// insertSort(testArray, () => Math.random() > 0.5)
// console.timeEnd('cost')
// // cost: 6ms 不够乱

/* ---------------------- 我是一条分割线 ㄟ( ▔, ▔ )ㄏ ---------------------- */

/** 二分查找 end在[start,end]中的位置
 * @test true
 *
 * @param {Array} array 待查找数组
 * @param {Compare} compare 数值比较方法
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含，该索引前的数组已有序）
 *
 * @returns {Number} end应插入位置
 */
function findByBinary<T>(
  array: T[],
  compare?: Compare,
  start?: number,
  end?: number
) {
  compare || (compare = ASC)
  start || (start = 0)
  end || (end = array.length - 1)

  const current = array[end]
  // 先检查边界情况
  if (+(compare(array[start], current) as any) > 0) {
    return start
  }
  if (!(+(compare(array[end - 1], current) as any) > 0)) {
    return end
  }

  // 二分查找插入位置
  let mid: number
  let high = end - 2
  let low = start + 1
  while (low <= high) {
    mid = (low + high) >> 1 // 除2向下取整
    if (+(compare(array[mid], current) as any) > 0) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return low
}

/** 将数组b位置冒泡到前面的a位置
 * @test true
 *
 * @param {Array} array 目标数组
 * @param {Number} a 目标位置
 * @param {Number} b 现在位置
 *
 * @returns {Array} 原数组
 */
function bubble<T>(array: T[], a: number, b: number): T[] {
  if (b > a) {
    const current = array[b]

    while (b > a) {
      array[b] = array[--b]
    }
    array[a] = current
  }

  return array
}

/** 二分插入排序(稳定)
 * @test true
 *
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数值比较方法
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 *
 * @returns {Array} 原数组
 */
function insertSortBinary<T>(
  array: T[],
  compare?: Compare<T>,
  start?: number,
  end?: number
): T[] {
  compare || (compare = ASC)
  start || (start = 0)
  end || (end = array.length - 1)

  let low: number
  let mid: number
  let high: number
  let curr = start
  let current: T
  while (curr++ < end) {
    current = array[curr]
    // 先检查边界情况
    if (!(+(compare(array[curr - 1], current) as any) > 0)) {
      continue
    }

    if (+(compare(array[start], current) as any) > 0) {
      low = start
    } else {
      // 二分查找插入位置
      low = start + 1
      high = curr - 2
      while (low <= high) {
        mid = (low + high) >> 1 // 除2向下取整
        if (+(compare(array[mid], current) as any) > 0) {
          high = mid - 1
        } else {
          low = mid + 1
        }
      }
    }
    // 插入
    mid = curr // 兼职
    while (mid > low) {
      array[mid] = array[--mid]
    }
    array[low] = current
  }

  return array
}

/// 耗时 ///
// const testArray: number[] = []
// let last = 10000
// while (last--) {
//   testArray.push(Math.random() * last)
// }

// console.time('cost')
// insertSortBinary(testArray)
// console.timeEnd('cost')
// // cost: 50ms
// console.time('cost')
// insertSortBinary(testArray)
// console.timeEnd('cost')
// // cost: 3.5ms
// console.time('cost')
// insertSortBinary(testArray, (a: number, b: number) => a < b)
// console.timeEnd('cost')
// // cost: 62ms
// console.time('cost')
// insertSortBinary(testArray, () => Math.random() > 0.5)
// console.timeEnd('cost')
// // cost: 31ms 不够乱

export { insertSortBinary as default, findByBinary, bubble }
