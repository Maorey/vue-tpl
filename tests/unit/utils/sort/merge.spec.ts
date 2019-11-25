/*
 * @Description: 归并排序 测试
 * @Author: 毛瑞
 * @Date: 2019-07-19 16:24:03
 */
import mergeSort from '@/utils/sort/merge'
import getRandomArray from './getRandomArray'

describe('@/utils/sort/merge: 归并排序', () => {
  it('mergeSort', () => {
    let arrayLength = 10000
    const testArray = getRandomArray(arrayLength--)

    let pass = true

    mergeSort(testArray)
    for (let i = 0; i < arrayLength; i++) {
      if (testArray[i + 1] < testArray[i]) {
        pass = false
        break
      }
    }

    if (pass) {
      mergeSort(testArray, (a, b) => a < b)
      for (let i = 0; i < arrayLength; i++) {
        if (testArray[i + 1] > testArray[i]) {
          pass = false
          break
        }
      }
    }

    expect(pass).toBe(true)
  })
})
