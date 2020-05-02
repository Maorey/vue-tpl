/*
 * @Description: 数组排序
 * @Author: 毛瑞
 * @Date: 2019-07-19 10:52:16
 */
import mergeSort from './merge' // 归并排序
// import quickSort from './quick' // 快速排序

/** 排序比较方法
 * a>b <=> +(compare(a,b) as any)>0 其他情况说不好:true==1 false==0
 * @param {Any} a 待比较的值之一
 * @param {Any} b 待比较的值之二
 *
 * @returns {Number | Boolean | null | undefined} true/大于0数字: a在b后; 其它: a在b前
 */
export type Compare<T = any> = (
  a: T,
  b: T
) => number | boolean | null | undefined

/** 升序 */
const ASC: Compare = (a: any, b: any) => a > b

/** 降序 */
const DES: Compare = (a: any, b: any) => a <= b

/** 排序 尝试各种组合后还是归并最快
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数值比较方法
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 * #param {Boolean} reverse 数值相等时: true:颠倒相对顺序 undefined:保留相对顺序 false: 任意
 *
 * @returns {Array} 原数组
 */
// function sort<T>(
//   array: T[],
//   compare?: Compare<T>,
//   start?: number,
//   end?: number
// ): T[] {
//   compare || (compare = ASC)
//   start || (start = 0)
//   end || (end = array.length - 1)

//   if (end > start) {
//     // 桶排序/组合排序
//     mergeSort(array, compare, start, end)
//   }

//   return array
// }

export { mergeSort as default, ASC, DES }
