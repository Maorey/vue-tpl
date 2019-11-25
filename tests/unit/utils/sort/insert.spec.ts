/*
 * @Description: 插入排序 测试
 * @Author: 毛瑞
 * @Date: 2019-07-19 16:24:03
 */
import insertSort, { findByBinary, bubble } from '@/utils/sort/insert'
import getRandomArray from './getRandomArray'

describe('@/utils/sort/insert: 插入排序', () => {
  const DES = (a: number, b: number) => a < b

  it('insertSort', () => {
    let arrayLength = 10000
    const testArray = getRandomArray(arrayLength--)

    let pass = true

    insertSort(testArray)
    for (let i = 0; i < arrayLength; i++) {
      if (testArray[i + 1] < testArray[i]) {
        pass = false
        break
      }
    }

    if (pass) {
      insertSort(testArray, DES)
      for (let i = 0; i < arrayLength; i++) {
        if (testArray[i + 1] > testArray[i]) {
          pass = false
          break
        }
      }
    }

    expect(pass).toBe(true)
  })

  it('findByBinary', () => {
    const ASC_ARRAY = [0, 1, 1, 3, 4, 5, 5, 1]

    expect(findByBinary(ASC_ARRAY, undefined, 1, 5)).toBe(5) // 末尾最大
    expect(findByBinary(ASC_ARRAY, undefined, 0, 6)).toBe(6) // 末尾等于前一个
    expect(findByBinary(ASC_ARRAY, undefined, 0, 7)).toBe(3) // 末尾中间
    expect(findByBinary(ASC_ARRAY, undefined, 3, 7)).toBe(3) // 末尾最小
    expect(findByBinary(ASC_ARRAY, undefined, 1, 7)).toBe(3) // 末尾等于第一个

    const DES_ARRAY = [5, 4, 3, 2, 1, 1, 0, 4]
    expect(findByBinary(DES_ARRAY, DES, 0, 6)).toBe(6) // 末尾最小
    expect(findByBinary(DES_ARRAY, DES, 0, 5)).toBe(5) // 末尾等于前一个
    expect(findByBinary(DES_ARRAY, DES, 0, 7)).toBe(2) // 末尾中间
    expect(findByBinary(DES_ARRAY, DES, 2, 7)).toBe(2) // 末尾最大
    expect(findByBinary(DES_ARRAY, DES, 1, 7)).toBe(2) // 末尾等于第一个
  })

  it('bubble', () => {
    expect(bubble([0, 1, 2, 3, 4, 5], 1, 5)).toEqual([0, 5, 1, 2, 3, 4])
  })
})
