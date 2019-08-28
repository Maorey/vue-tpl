/*
 * @Description: 快速排序 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 17:41:06
 */
import quickSort from '@/utils/utils/sort/quick'
import getRandomArray from './getRandomArray'

test('quickSort', () => {
  let arrayLength = 10000
  const testArray = getRandomArray(arrayLength--)

  let pass = true

  quickSort(testArray)
  for (let i = 0; i < arrayLength; i++) {
    if (testArray[i + 1] < testArray[i]) {
      pass = false
      break
    }
  }

  if (pass) {
    quickSort(testArray, (a, b) => a < b)
    for (let i = 0; i < arrayLength; i++) {
      if (testArray[i + 1] > testArray[i]) {
        pass = false
        break
      }
    }
  }

  expect(pass).toBe(true)
})
