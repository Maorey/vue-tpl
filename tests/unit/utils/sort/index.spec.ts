/*
 * @Description: 排序 测试
 * @Author: 毛瑞
 * @Date: 2019-07-26 22:16:08
 */

import sort from '@/utils/sort'
import getRandomArray from './getRandomArray'

describe('@/utils/sort: 排序', () => {
  it('sort', () => {
    let arrayLength = 10000
    const testArray = getRandomArray(arrayLength--)

    let pass = true

    sort(testArray)
    for (let i = 0; i < arrayLength; i++) {
      if (testArray[i + 1] < testArray[i]) {
        pass = false
        break
      }
    }

    if (pass) {
      sort(testArray, (a, b) => a < b)
      for (let i = 0; i < arrayLength; i++) {
        if (testArray[i + 1] > testArray[i]) {
          pass = false
          break
        }
      }
    }

    expect(pass).toBe(true)

    expect(sort(['l', 'k', 'j', 'h', 'g', 'f', 'd', 's', 'a'])).toEqual([
      'a',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      's',
    ])
  })
})
