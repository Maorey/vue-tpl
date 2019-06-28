/*
 * @Description: 快速排序 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 17:41:06
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-28 09:57:12
 */
import quickSort from '@/utils/functions/quickSort'

test('quickSort', () => {
  const testArray: number[] = []
  const DES = (a: number, b: number): boolean => a < b // 降序

  let arrayLength: number = 10000
  while (arrayLength--) {
    testArray.push(Math.random() * arrayLength)
  }
  arrayLength = testArray.length - 1

  console.time('quickSort ' + arrayLength + ' cost:')
  quickSort(testArray)
  console.time('quickSort ' + arrayLength + ' cost:')

  let pass: boolean = true

  for (let i: number = 0; i < arrayLength; i++) {
    if (testArray[i + 1] < testArray[i]) {
      pass = false
    }
  }
  expect(pass).toBe(true)

  quickSort(testArray, DES)
  for (let i: number = 0; i < arrayLength; i++) {
    if (testArray[i + 1] > testArray[i]) {
      pass = false
    }
  }
  expect(pass).toBe(true)
})
