/*
 * @Description: 快速排序(稳定)
 *  https://blog.csdn.net/qq_38289815/article/details/82718428
 *  http://www.blogjava.net/killme2008/archive/2010/09/08/quicksort_optimized.html
 * @Author: 毛瑞
 * @Date: 2019-07-19 21:33:33
 */

import { ASC, Compare } from '.'

/** 数组长度低值:小于低值使用插入排序
 */
const LOW: number = 6
/** 数组长度高值 划分时:介于低值高值左中右3数取中值,大于高值左中右各3个数取中值(9数取中)
 */
const HIGH: number = 40
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
  [LIST[p1], LIST[p2]] = [LIST[p2], LIST[p1]]
}

/** 得到数组里 指定3个递增的索引 的中值索引 (最多比较三次,优先中间)
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 *
 * @returns {Number} 中值索引
 */
function mid3(a: number, b: number, c: number): number {
  /// ↓【所有情况】↓ ///
  // /// 至少两个相等 ///
  // const ab: any = contrast(LIST[a], LIST[b])
  // if (ab === 0) {
  //   return b
  // }
  // const bc: any = contrast(LIST[b], LIST[c])
  // if (bc === 0) {
  //   return b
  // }
  // const ac: any = contrast(LIST[a], LIST[c])
  // if (ac === 0) {
  //   return b
  // }
  // /// 全都不相等 ///
  // return Number(ab) > 0 // a > b
  //   ? Number(bc) > 0
  //     ? b // b > c && b < a
  //     : Number(ac) > 0 // b最小
  //       ? a
  //       : c
  //   : Number(bc) > 0
  //     ? Number(ac) > 0 // b最大
  //       ? c
  //       : a
  //     : b // b > a && b < c
  /// ↑【所有情况】↑ ///

  // 减少比较，尽早返回
  let ab: any = contrast(LIST[a], LIST[b]) // (兼职:ac)
  if (ab === 0) {
    return b
  }

  let bc: any = contrast(LIST[b], LIST[c])
  if (bc === 0) {
    return b
  }

  bc = Number(bc) > 0
  ab = Number(ab) > 0
  if (ab === bc) {
    // (Number(ab) > 0) === bc 加括号格式化代码会去掉 ┐(：´ゞ｀)┌
    // 同号: b > c && a > b 或者 b < c && a < b
    return b
  }

  ab = contrast(LIST[a], LIST[c]) // ac
  if (ab === 0) {
    return b
  }

  // b > c && a < b(bc=true,b最大) 或者 b < c && a > b(bc=false,b最小)
  return Number(ab) > 0 ? (bc ? a : c) : bc ? c : a
  // 交换破坏稳定性
  // ab = Number(ab) > 0
  // if (ab === bc) {
  //   // 取a: (bc && ac) || (!bc && !ac)
  //   bc && swap(LIST, b, c)
  //   swap(LIST, a, b)
  //   return b
  // }

  // // 取c: (bc && !ac) || (!bc && ac)
  // bc || swap(LIST, a, b)
  // swap(LIST, b, c)
  // return b
}

/** 快速排序(稳定)
 *    怎么就写得这么难看了 ┐(：´ゞ｀)┌
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 *
 * @returns {Array} 原数组
 */
function partition(start: number, end: number): void {
  let result: any = end - start // (打杂)
  if (result < LOW) {
    // 使用插入排序
    insertSort(start, end)
    return
  }
  /// 选择基准 ///
  // tslint:disable-next-line: no-bitwise 9 -> 4, 10 -> 4
  let pivot: number = start + (result++ >> 1)
  if (result > HIGH) {
    // tslint:disable-next-line: no-bitwise
    result = result >> 3
    pivot = mid3(
      // tslint:disable-next-line: no-bitwise
      mid3(start, start + result, start + (result << 1)),
      mid3(pivot - result, pivot, pivot + result),
      // tslint:disable-next-line: no-bitwise
      mid3(end - (result << 1), end - result, end)
    )
  } else {
    pivot = mid3(start, pivot, end)
  }
  /// 划分数组 |=pivotValue|<pivotValue|pivotValue|>pivotValue|=pivotValue| ///
  const pivotValue: any = LIST[pivot]
  let left: number = pivot === start ? start + 1 : start // 左扫描索引
  let right: number = pivot === end ? end - 1 : end // 右扫描索引
  let leftEqual: number = left // 左侧相等值<=left(不含)
  let rightEqual: number = right // 右侧相等值>=right(不含)
  let leftHit: boolean // 左侧是否找到
  let rightHit: boolean // 右侧是否找到
  while (true) {
    leftHit = rightHit = false
    // 从左侧起找到大于pivotValue的元素并交换等于的到两端(已在两端的除外)
    while (left < right) {
      if (left !== pivot) {
        result = contrast(LIST[left], pivotValue)
        if (result === 0) {
          if (left < pivot) {
            left > leftEqual && swap(leftEqual, left)
            leftEqual++
          } else {
            break // 稳定
          }
        } else if (Number(result) > 0) {
          leftHit = true
          break
        }
      }
      left++
    }
    // 从右侧起找到小于pivot的元素并交换等于的到两端(已经在两端的除外)
    while (right >= left) {
      if (leftHit && right === left) {
        break
      }
      if (right !== pivot) {
        result = contrast(pivotValue, LIST[right])
        if (result === 0) {
          if (right > pivot) {
            right < rightEqual && swap(right, rightEqual)
            rightEqual--
          } else {
            break // 稳定
          }
        } else if (Number(result) > 0) {
          rightHit = true
          break
        }
      }
      right--
    }

    if (left < right) {
      // 左侧大于pivotValue的元素与右侧小于pivotValue的元素交换
      swap(left++, right--)
    } else {
      // rightHit/leftHit:  false true // 左右扫描是否找到目标 不可能同时true
      if (rightHit) {
        result = right >= pivot ? right : right + 1
      } else if (leftHit) {
        result = left <= pivot ? left : left - 1
      } else {
        result = right > pivot ? right : pivot
      }

      leftHit = pivot === start // (兼职)
      rightHit = pivot === end // (兼职)

      if (result !== pivot) {
        swap(pivot, result)
        pivot = result
      }

      break
    }
  }
  /// 相等值交换到移到pivot左右 ///
  if (leftEqual === pivot) {
    left = start // 左侧已有序
  } else {
    left = pivot
    if (!leftHit) {
      while (leftEqual > start) {
        swap(--leftEqual, --left)
      }
    }
  }
  if (rightEqual === pivot) {
    right = end // 右侧已有序
  } else {
    right = pivot
    if (!rightHit) {
      while (rightEqual < end) {
        swap(++right, ++rightEqual)
      }
    }
  }

  /// 尾递归子序列 ///
  --left > start && partition(start, left)
  ++right < end && partition(right, end)
}

/** 快速排序(稳定)【未完成】
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数值比较方法
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 *
 * @returns {Array} 原数组
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

// let id: number = 0
// function check(array: number[]): void {
//   id++
//   for (let i: number = 1, len = array.length; i < len; i++) {
//     if (array[i] < array[i - 1]) {
//       console.log('failed: ', id)
//       console.log(array)
//       debugger
//       return
//     }
//   }
//   console.log('pass: ', id)
// }

// // 升降奇偶
// check(quickSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
// check(quickSort([1, 2, 3, 4, 5, 6, 7, 8, 9]))

// check(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]))
// check(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1]))

// // pivot选取相等
// check(quickSort([0, 1, 2, 3, 0, 5, 6, 7, 8, 0]))
// check(quickSort([0, 1, 2, 3, 0, 5, 6, 7, 8, 9]))
// check(quickSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 0]))
// check(quickSort([9, 1, 2, 3, 0, 5, 6, 7, 8, 0]))

// check(quickSort([9, 8, 7, 6, 9, 4, 3, 2, 1, 9]))
// check(quickSort([9, 8, 7, 6, 9, 4, 3, 2, 1, 0]))
// check(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1, 9]))
// check(quickSort([9, 8, 7, 6, 0, 4, 3, 2, 1, 0]))

// // 乱序 (Math.random() * 10) | 0
// check(quickSort([6, 3, 4, 8, 5, 9, 1, 7, 0, 2]))

// // 重复升降奇偶
// check(quickSort([5, 1, 2, 3, 4, 4, 4, 4, 4, 4]))
// check(quickSort([4, 4, 4, 4, 4, 4, 3, 2, 1, 0]))
// check(quickSort([4, 1, 4, 1, 4, 1, 4, 1, 4, 1]))
// check(quickSort([4, 4, 4, 4, 4, 4, 4, 4, 4, 4]))
// check(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
// check(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
// check(quickSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]))
// check(quickSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1]))
// check(quickSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
// check(quickSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
// check(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]))
// check(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1]))

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
