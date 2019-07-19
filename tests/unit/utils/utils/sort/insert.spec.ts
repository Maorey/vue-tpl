/*
 * @Description: 插入排序 测试
 * @Author: 毛瑞
 * @Date: 2019-07-19 16:24:03
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-19 20:57:10
 */
import insertSort from '@/utils/utils/sort/insert'

test('insertSort', () => {
  const testArray: number[] = []

  let arrayLength: number = 10000
  while (arrayLength--) {
    testArray.push(Math.random() * arrayLength)
  }
  arrayLength = testArray.length - 1

  let pass: boolean = true

  insertSort(testArray)
  for (let i: number = 0; i < arrayLength; i++) {
    if (testArray[i + 1] < testArray[i]) {
      pass = false
      break
    }
  }

  if (pass) {
    insertSort(testArray, (a: number, b: number): boolean => a < b)
    for (let i: number = 0; i < arrayLength; i++) {
      if (testArray[i + 1] > testArray[i]) {
        pass = false
        break
      }
    }
  }

  expect(pass).toBe(true)
})
