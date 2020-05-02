/*
 * @Description: 快速排序(稳定)
 *  https://blog.csdn.net/qq_38289815/article/details/82718428
 *  http://www.blogjava.net/killme2008/archive/2010/09/08/quicksort_optimized.html
 * @Author: 毛瑞
 * @Date: 2019-07-19 21:33:33
 */
import { ASC, Compare } from '.'

/** 数组长度低值:小于低值使用插入排序 */
const LOW = 6
/** 数组长度高值 划分时:介于低值高值左中右3数取中值,大于高值左中右各3个数取中值(9数取中)
 */
const HIGH = 40
// 将这些变量放入执行上下文
/** 待排序数组 */
let LIST: any[]
/** 数组元素比较方法 */
let contrast: Compare

/** 插入排序(稳定)
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 */
function insertSort(start: number, end: number) {
  let temp
  let current
  let pointer: number
  let anchor = start
  while (anchor++ < end) {
    current = LIST[(pointer = anchor)]
    while (
      pointer > start &&
      +(contrast((temp = LIST[pointer - 1]), current) as any) > 0
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
function swap(p1: number, p2: number) {
  ;[LIST[p1], LIST[p2]] = [LIST[p2], LIST[p1]]
}

/** 得到数组里 指定3个递增的索引 的中值索引 (最多比较三次,优先中间)
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 *
 * @returns {Number} 中值索引
 */
function mid3(a: number, b: number, c: number) {
  /// ↓【所有情况】↓ ///
  // /// 至少两个相等 ///
  // const ab = contrast(LIST[a], LIST[b])
  // if (ab === 0) {
  //   return b
  // }
  // const bc = contrast(LIST[b], LIST[c])
  // if (bc === 0) {
  //   return b
  // }
  // const ac = contrast(LIST[a], LIST[c])
  // if (ac === 0) {
  //   return b
  // }
  // /// 全都不相等 ///
  // return +(ab as any) > 0 // a > b
  //   ? +(bc as any) > 0
  //     ? b // b > c && b < a
  //     : +(ac as any) > 0 // b最小
  //       ? a
  //       : c
  //   : +(bc as any) > 0
  //     ? +(ac as any) > 0 // b最大
  //       ? c
  //       : a
  //     : b // b > a && b < c
  /// ↑【所有情况】↑ ///

  // 减少比较，尽早返回
  let ab = contrast(LIST[a], LIST[b]) // (兼职:ac)
  if (ab === 0) {
    return b
  }

  let bc = contrast(LIST[b], LIST[c])
  if (bc === 0) {
    return b
  }

  bc = +(bc as any) > 0
  ab = +(ab as any) > 0
  if (ab === bc) {
    // (+(ab as any) > 0) === bc 加括号格式化代码会去掉 ┐(：´ゞ｀)┌
    // 同号: b > c && a > b 或者 b < c && a < b
    return b
  }

  ab = contrast(LIST[a], LIST[c]) // ac
  if (ab === 0) {
    return b
  }

  // b > c && a < b(bc=true,b最大) 或者 b < c && a > b(bc=false,b最小)
  return +(ab as any) > 0 ? (bc ? a : c) : bc ? c : a
  // 交换破坏稳定性
  // ab = +(ab as any) > 0
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
function partition(start: number, end: number) {
  let result: any = end - start // (打杂)
  if (result < LOW) {
    // 使用插入排序
    insertSort(start, end)
    return
  }
  /// 选择基准 ///
  // 9 -> 4, 10 -> 4
  let pivot = start + (result++ >> 1)
  if (result > HIGH) {
    result = result >> 3
    pivot = mid3(
      mid3(start, start + result, start + (result << 1)),
      mid3(pivot - result, pivot, pivot + result),
      mid3(end - (result << 1), end - result, end)
    )
  } else {
    pivot = mid3(start, pivot, end)
  }
  /// 划分数组 |=pivotValue|<pivotValue|pivotValue|>pivotValue|=pivotValue| ///
  const pivotValue = LIST[pivot]
  let left = pivot === start ? start + 1 : start // 左扫描索引
  let right = pivot === end ? end - 1 : end // 右扫描索引
  let leftEqual = left // 左侧相等值<=left(不含)
  let rightEqual = right // 右侧相等值>=right(不含)
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
        } else if (+(result as any) > 0) {
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
        } else if (+(result as any) > 0) {
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
function quickSort<T>(
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

    partition(start, end)

    LIST = contrast = 0 as any // 释放引用
  }

  return array
}

// let id = 0
// function check(array: number[]) {
//   id++
//   for (let i = 1, len = array.length; i < len; i++) {
//     if (array[i] < array[i - 1]) {
//       console.log('failed: ', id)
//       console.log(array)
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
// check(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
//  0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
// check(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
// check(quickSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
//  9, 8, 7, 6, 5, 4, 3, 2, 1, 0]))
// check(quickSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1]))
// check(quickSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
//  0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
// check(quickSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
//  1, 2, 3, 4, 5, 6, 7, 8, 9]))
// check(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
//  9, 8, 7, 6, 5, 4, 3, 2, 1, 0]))
// check(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1]))

/// 耗时 > 不稳定版 ///
// const testArray: number[] = []
// let last = 10000
// while (last--) {
//   testArray.push(Math.random() * last)
// }

// console.time('cost')
// quickSort(testArray)
// console.timeEnd('cost')
// // cost: ?ms
// console.time('cost')
// quickSort(testArray)
// console.timeEnd('cost')
// // cost: ?ms
// console.time('cost')
// quickSort(testArray, (a: number, b: number) => a < b)
// console.timeEnd('cost')
// // cost: ?ms
// console.time('cost')
// quickSort(testArray, () => Math.random() > 0.5)
// console.timeEnd('cost')
// // cost: ?ms

export default quickSort
