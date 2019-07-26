/*
 * @Description: 排序 测试
 * @Author: 毛瑞
 * @Date: 2019-07-26 22:16:08
 */

import sort from '@/utils/utils/sort'

test('quickSort', () => {
  const testArray: number[] = []

  let arrayLength: number = 10000
  while (arrayLength--) {
    testArray.push(Math.random() * arrayLength)
  }
  arrayLength = testArray.length - 1

  let pass: boolean = true

  sort(testArray)
  for (let i: number = 0; i < arrayLength; i++) {
    if (testArray[i + 1] < testArray[i]) {
      pass = false
      break
    }
  }

  if (pass) {
    sort(testArray, (a: number, b: number): boolean => a < b)
    for (let i: number = 0; i < arrayLength; i++) {
      if (testArray[i + 1] > testArray[i]) {
        pass = false
        break
      }
    }
  }

  expect(pass).toBe(true)

  expect(sort(['l', 'k', 'j', 'h', 'g', 'f', 'd', 's', 'a']))
    .toEqual(['a', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 's'])
})
