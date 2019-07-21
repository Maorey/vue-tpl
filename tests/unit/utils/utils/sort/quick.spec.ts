/*
 * @Description: 快速排序 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 17:41:06
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-21 22:31:08
 */
import quickSort from '@/utils/utils/sort/quick'

test('quickSort', () => {
  const testArray: number[] = []

  let arrayLength: number = 10000
  while (arrayLength--) {
    testArray.push(Math.random() * arrayLength)
  }
  arrayLength = testArray.length - 1

  let pass: boolean = true

  quickSort(testArray)
  for (let i: number = 0; i < arrayLength; i++) {
    if (testArray[i + 1] < testArray[i]) {
      pass = false
      break
    }
  }

  if (pass) {
    quickSort(testArray, (a: number, b: number): boolean => a < b)
    for (let i: number = 0; i < arrayLength; i++) {
      if (testArray[i + 1] > testArray[i]) {
        pass = false
        break
      }
    }
  }

  expect(pass).toBe(true)
})
