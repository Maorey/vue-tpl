/*
 * @Description: 颜色处理 测试
 * @Author: 毛瑞
 * @Date: 2019-07-03 17:26:45
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-03 17:32:28
 */

import { toGRB } from '@/utils/utils/color'

const HEX1 = '#abc'
const HEX2 = '#abcd'
const RGB1 = 'rgb(170,187,204)'
const RGB2 = ''

test('color to rgb(a)', () => {
  expect(toGRB(HEX1)).toBe(RGB1)
  expect(toGRB(HEX2)).toBe(RGB2)
})
