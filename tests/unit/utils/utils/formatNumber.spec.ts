/*
 * @Description: 格式化数字 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 18:08:54
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-27 18:25:11
 */

import formatNumber from '@/utils/utils/formatNumber'

test('formatNumber', () => {
  expect(formatNumber(1234567890.9876)).toBe('1,234,567,890.9876')

  expect(formatNumber(1234567890.9876, 2)).toBe('1,234,567,890.99')

  expect(formatNumber(1234567890.9876, '万')).toBe('1,234,567,890.9876万')
  expect(
    formatNumber(1234567890.9876, {
      len: 4,
      unit: '万',
    })
  ).toBe('123,456.78909876万')
  expect(
    formatNumber(1234567890.9876, {
      len: 4,
      unit: '万',
      limit: 1234567891,
    })
  ).toBe('1,234,567,890.9876')

  expect(formatNumber(1234567890.9876, 2, '万')).toBe('1,234,567,890.99万')
  expect(
    formatNumber(1234567890.9876, 2, {
      len: 4,
      unit: '万',
    })
  ).toBe('123,456.79万')
})
