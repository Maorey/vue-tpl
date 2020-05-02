/*
 * @Description: 归并排序
 *  see: https://www.cnblogs.com/eniac12/p/5329396.html#s4
 * @Author: 毛瑞
 * @Date: 2019-07-19 10:53:34
 */
import { ASC, Compare } from '.'

// 将这些变量放入执行上下文
/** 待排序数组 */
let LIST: any[]
/** 数组元素比较方法 */
let contrast: Compare

/** 插入排序(稳定)
 * @deprecated 相比merge: 耗时更高，包括设置阈值切换
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 */
// function insertSort(start: number, end: number) {
//   let temp
//   let current
//   let pointer: number
//   let anchor = start
//   while (anchor++ < end) {
//     current = LIST[(pointer = anchor)]
//     while (
//       pointer > start &&
//       +(contrast((temp = LIST[pointer - 1]), current) as any) > 0
//     ) {
//       LIST[pointer--] = temp
//     }
//     pointer < anchor && (LIST[pointer] = current)
//   }
// }

/** 合并原数组上连续的两个有序数组(比如:[1,3,5,7,9,0,2,4,6,8] 借助数组方法)
 *    相比merge: 耗时5倍左右
 * @deprecated
 * @param {Number} left 第一个数组起始索引
 * @param {Number} middle 第一个数组结束索引
 * @param {Number} right 第二个数组结束索引
 */
// function mergeSp(left: number, middle: number, right: number) {
//   middle++ // 第二个数组起始索引
//   let temp
//   while (left < right) {
//     temp = LIST[middle]
//     LIST.splice(middle++, 1)
//     if (+(contrast(LIST[left], temp) as any) > 0) {
//       // j在i前
//       left ? LIST.splice(left - 1, 0, temp) : LIST.unshift(temp)
//     } else {
//       // j在i后 保持相对顺序不变
//       LIST.splice(++left, 0, temp)
//     }
//     left++
//   }
// }

/** 二分合并原数组上连续的两个有序数组(比如:[1,3,5,7,9,0,2,4,6,8] 借助辅助数组)
 *    相比merge: 耗时2~3倍，设置阈值切换最好也耗时1.5倍
 * @param {Number} left 第一个数组起始索引
 * @param {Number} middle 第一个数组结束索引
 * @param {Number} right 第二个数组结束索引
 */
// function mergeBinary(left: number, middle: number, right: number) {
//   const LOW = left + 1
//   const leftValue = LIST[left]
//   // 辅助数组(slice比较快就不复用数组了)
//   const temp = LIST.slice(middle + 1, right + 1)
//   let curr = temp.length - 1 // 辅助数组结束索引
//   let low: number
//   let mid: number
//   let high: number
//   let current

//   while (middle >= left && curr >= 0) {
//     current = temp[curr]
//     // 先检查边界情况
//     if (+(contrast(leftValue, current) as any) > 0) {
//       while (middle >= left) {
//         LIST[right--] = LIST[middle--]
//       }
//       continue
//     }
//     curr--
//     if (!(+(contrast(LIST[middle], current) as any) > 0)) {
//       LIST[right--] = current
//       continue
//     }
//     // 二分查找插入位置
//     low = LOW
//     high = middle - 1
//     while (low <= high) {
//       mid = (low + high) >> 1 // 除以2向下取整
//       if (+(contrast(LIST[mid], current) as any) > 0) {
//         high = mid - 1
//       } else {
//         low = mid + 1
//       }
//     }
//     // 插入
//     while (middle >= low) {
//       LIST[right--] = LIST[middle--]
//     }
//     LIST[right--] = current
//   }

//   while (curr >= 0) {
//     LIST[right--] = temp[curr--]
//   }
// }

/// 耗时 ///
// const testArray: number[] = []
// let last = 10000
// while (last--) {
//   testArray.push(Math.random() * last)
// }

// console.time('cost')
// mergeSort(testArray)
// console.timeEnd('cost')
// // cost: 21ms
// console.time('cost')
// mergeSort(testArray)
// console.timeEnd('cost')
// // cost: 10ms
// console.time('cost')
// mergeSort(testArray, (a: number, b: number) => a < b)
// console.timeEnd('cost')
// // cost: 26ms
// console.time('cost')
// mergeSort(testArray, () => Math.random() > 0.5)
// console.timeEnd('cost')
// // cost: 32ms

/* ---------------------- 我是一条分割线 ㄟ( ▔, ▔ )ㄏ ---------------------- */

/** 合并原数组上连续的两个有序数组(比如:[1,3,5,7,9,0,2,4,6,8] 借助辅助数组)
 * @param {Number} left 第一个数组起始索引
 * @param {Number} middle 第一个数组结束索引
 * @param {Number} right 第二个数组结束索引
 */
function merge(left: number, middle: number, right: number) {
  // // 尽量减小辅助数组大小【耗时会略增加，为啥】
  // while (right > middle) {
  //   if (+(contrast(LIST[middle], LIST[right]) as any) > 0) {
  //     break
  //   }
  //   right--
  // }
  // if (right > middle) {
  //   LIST[right--] = LIST[middle--] // ↓↓ ...
  // 辅助数组(slice比较快就不复用数组了)
  const temp = LIST.slice(middle + 1, right + 1)
  let index = temp.length - 1 // 辅助数组结束索引

  while (middle >= left && index >= 0) {
    LIST[right--] =
      +(contrast(LIST[middle], temp[index]) as any) > 0
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
function mergeSort<T>(
  array: T[],
  compare?: Compare<T>,
  start?: number,
  end?: number
): T[] {
  compare || (compare = ASC)
  start || (start = 0)
  end || (end = array.length - 1)

  if (end > start) {
    LIST = array
    contrast = compare

    // 子数组索引 前一个为[left, ..., middle]，后一个为[middle + 1, ..., right]
    let left: number
    let middle: number
    let right: number

    let size = 1 // 子数组的大小 【那么2/4/8...归并就是最高效的了】
    do {
      left = start
      while ((middle = left + size - 1) < end) {
        // 【并不能减少耗时，哪怕只是二者交换，又是为啥?】
        // if (right - left < CUTOFF) {
        //   insertSort(left, right)
        // } else {
        // if (size === 1) {
        //   +(contrast(LIST[left], LIST[++middle]) as any) > 0 &&
        //     ([LIST[left], LIST[middle]] = [LIST[middle], LIST[left]])
        //   left = middle + 1
        // } else {
        right = middle + size
        right > end && (right = end) // 比Math.min快
        merge(left, middle, right) // 归并
        left = right + 1
      }
      size <<= 1 // 每轮翻倍(*2)
    } while (size < end)
    left > end || merge(0, left - 1, end) // 末尾捡漏

    LIST = contrast = 0 as any // 释放引用
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
// mergeSort(testArray)
// console.timeEnd('cost')
// // cost: 8ms
// console.time('cost')
// mergeSort(testArray)
// console.timeEnd('cost')
// // cost: 3.5ms
// console.time('cost')
// mergeSort(testArray, (a: number, b: number) => a < b)
// console.timeEnd('cost')
// // cost: 14ms
// console.time('cost')
// mergeSort(testArray, () => Math.random() > 0.5)
// console.timeEnd('cost')
// // cost: 12ms

export default mergeSort
