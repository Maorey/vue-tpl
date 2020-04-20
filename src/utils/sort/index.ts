/*
 * @Description: 数组排序
 * @Author: 毛瑞
 * @Date: 2019-07-19 10:52:16
 */
import mergeSort from './merge' // 归并排序
// import quickSort from './quick' // 快速排序

/** 排序比较方法
 * a>b <=> Number(compare(a,b))>0 其他情况说不好:true==1 false==0
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
// const ASC: Compare = (a: any, b: any): 0 | boolean => (a === b ? 0 : a > b)

/** 降序 */
const DES: Compare = (a: any, b: any) => a < b
// const DES: Compare = (a: any, b: any): 0 | boolean => (a === b ? 0 : a < b)

/** 目标值是否基础类型
 * @param {Any} value 目标值
 *
 * @returns {Boolean} 是否基础类型
 */
// function isBaseType(value: any) {
//   return (
//     value === null ||
//     value === undefined ||
//     value.constructor === Number ||
//     value.constructor === String ||
//     value.constructor === Boolean
//     // typeof value === 'symbol' // 不能类型转换和比较大小（只能 === 或 == ）
//   )
// }

/** 排序 基础类型(数字/字符串):快速排序 非基础类型:归并排序(稳定)
 *    尝试各种组合后还是归并最快
 * @param {Array} array 待排序数组
 * @param {Compare} compare 数值比较方法
 * @param {Number} start 数组起始索引（含）
 * @param {Number} end 数组结束索引（含）
 *
 * #param {Boolean} reverse 数值相等时: true:颠倒相对顺序 undefined:保留相对顺序 false: 任意
 *
 * @returns {Array} 原数组
 */
// function sort<T>(
//   array: T[],
//   compare: Compare = ASC,
//   start?: number,
//   end?: number,
// ): T[] {
//   start === undefined && (start = 0)
//   end === undefined && (end = array.length - 1)

//   if (end > start) {
//     if (isBaseType(array[start]) && isBaseType(array[end])) {
//       // 不可变类型
//       return quickSort(array, compare, start, end)
//     }
//     return mergeSort(array, compare, start, end)
//   }

//   return array
// }

export { mergeSort as default, ASC, DES }
