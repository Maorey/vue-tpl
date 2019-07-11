/*
 * @Description: 快速排序, 交换数组索引并返回【不会被vue2监测到数组变化】
 *  参考 https://segmentfault.com/a/1190000010928302#articleHeader4
 * @Author: 毛瑞
 * @Date: 2019-06-27 13:01:27
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-11 17:30:14
 */

/** 排序比较方法
 * @param {Any} one 待比较的值之一
 * @param {Any} two 待比较的值之二
 *
 * @returns {Any} 返回 truthy: one在two前; falsy: one在two后
 */
type Compare = (one: any, two: any) => any

/** 使用插入排序阈值 最佳取4
 */
const CUTOFF: number = 4
/** 升序
 */
const ASC: Compare = (one: any, two: any): boolean => one > two

// 闭包变量
let arr: any[]
let compare: Compare

/** 比较并交换数据
 * @param {Number} i 待交换的数组索引
 * @param {Number} j 待交换的数组索引
 * @param {boolean} force 直接交换（不通过compare回调来比较）
 */
function swap(i: number, j: number, force?: boolean | undefined): void {
  (force || compare(arr[i], arr[j])) && ([arr[i], arr[j]] = [arr[j], arr[i]])
}

/** 插入排序
 * @param {Number} left 数组起始索引（含）
 * @param {Number} right 数组结束索引（含）
 */
function insertSort(left: number, right: number): void {
  for (let i: number = left; i < right; i++) {
    for (let j: number = i + 1; j > left; j--) {
      swap(j - 1, j)
    }
  }
}

/** 得到主元 【左中右排序取中位数，并把中位数交换到倒数第二个】
 * @param {Number} left 数组起始索引（含）
 * @param {Number} right 数组结束索引（含）
 *
 * @returns {Any} 主元
 */
function findPivot(left: number, right: number): any {
  const center: number = Math.floor((left + right) / 2)

  // 将中位数放在中间 至少比较三次
  swap(left, center)
  swap(left, right)
  swap(center, right)

  // 将主元换到右二 使之不参与后面的一系列交换
  swap(center, --right, true)

  return arr[right]
}

/** 分割
 * @param {Number} left 数组起始索引（含）
 * @param {Number} right 数组结束索引（含）
 */
function partition(left: number, right: number): void {
  if (right - left < CUTOFF) {
    // 数组长度小于阈值时采用插入排序
    insertSort(left, right)
  } else {
    // 得到主元 且左中右有序
    const pivot: any = findPivot(left, right)
    // 数组长度大于阈值采用快速排序
    // 从两边向中间找 比主元大的放到同一边 小的另一边
    let i: number = left + 1 // 最左除外
    let j: number = right - 2 // 主元（right - 1处）及最右除外

    while (i < j) {
      // 从左边开始找到第一个比主元大/小的
      while (i < j && compare(pivot, arr[i])) {
        i++
      }
      // 从右边开始找到第一个比主元小/大的
      while (j > i && compare(arr[j], pivot)) {
        j--
      }

      // 将左边大/小于主元的交换到右边
      i < j && swap(i++, j--, true)

      // 出现相等时的主元位置
      i === j && compare(pivot, arr[i]) && i++
    }

    // 主元换到合适位置
    // i前面已经++了 现在是主元的位置
    swap(i, right - 1, true)

    // 对主元左侧的子数组展开快排
    left < i - 1 && partition(left, i - 1)
    // 对主元右侧的子数组展开快排
    i + 1 < right && partition(i + 1, right)
  }
}

/** 快速排序, 交换数组索引并返回【不会被vue2监测到数组变化】
 * https://segmentfault.com/a/1190000010928302#articleHeader4
 * @test true
 *
 * @param {Array} arr 待排序数组
 * @param {Function} compare 【可选，默认升序】a > b时：返回真值则升序，返回假值则降序
 *
 * @returns {Array} arr 排序后的原数组
 */
function quickSort(array: any[], fun: Compare = ASC): any[] {
  if (!Array.isArray(array) || array.length < 2) {
    return array
  }

  arr = array
  compare = fun

  partition(0, arr.length - 1)

  return arr
}

export default quickSort
