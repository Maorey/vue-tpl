/*
 * @Description: 插入排序 测试（为啥就它RUNS很多遍？？？）
 * @Author: 毛瑞
 * @Date: 2019-07-19 16:24:03
 */
import insertSort from '@/utils/utils/sort/insert'
import getRandomArray from './getRandomArray'

test('insertSort', () => {
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
    insertSort(testArray, (a, b) => a < b)
    for (let i = 0; i < arrayLength; i++) {
      if (testArray[i + 1] > testArray[i]) {
        pass = false
        break
      }
    }
  }

  expect(pass).toBe(true)
})
