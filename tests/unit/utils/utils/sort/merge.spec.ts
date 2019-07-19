/*
 * @Description: 归并排序 测试
 * @Author: 毛瑞
 * @Date: 2019-07-19 16:24:03
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-19 16:43:00
 */
import mergeSort from '@/utils/utils/sort/merge'
// import mergeSort from 'F:\\template\\vue-tpl\\build\\src\\utils\\utils\\sort\\merge.js'

test('mergeSort', () => {
  const testArray: number[] = []

  let arrayLength: number = 10000
  while (arrayLength--) {
    testArray.push(Math.random() * arrayLength)
  }
  arrayLength = testArray.length - 1

  let pass: boolean = true

  mergeSort(testArray, (a: number, b: number): boolean => a > b)
  for (let i: number = 0; i < arrayLength; i++) {
    if (testArray[i + 1] < testArray[i]) {
      pass = false
      break
    }
  }

  if (pass) {
    mergeSort(testArray, (a: number, b: number): boolean => a < b)
    for (let i: number = 0; i < arrayLength; i++) {
      if (testArray[i + 1] > testArray[i]) {
        pass = false
        break
      }
    }
  }

  expect(pass).toBe(true)
})
