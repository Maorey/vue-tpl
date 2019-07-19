/*
 * @Description: 插入排序(不使用不稳定的希尔排序，不使用二分查找)
 * @Author: 毛瑞
 * @Date: 2019-07-19 17:29:55
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-19 17:34:17
 */

import { Compare } from './'

/** 插入排序
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数组比较方法
 * @param {Number} left 数组起始索引（含）
 * @param {Number} right 数组结束索引（含）
 */
function insertSort(
  array: any[],
  compare: Compare,
  left?: number,
  right?: number
): any[] {
  left === undefined && (left = 0)
  right === undefined && (right = array.length - 1)

  // TODO

  return array
}

export default insertSort
