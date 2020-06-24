/*
 * @Description: 格式化数字 测试
 * @Author: 毛瑞
 * @Date: 2019-06-27 18:08:54
 */

import formatNumber from '@/utils/formatNumber'

describe('@/utils/formatNumber: 格式化数字', () => {
  it('formatNumber 默认格式化', () => {
    expect(formatNumber(1234567890.9876)).toBe('1,234,567,890.9876')
  })
  it('formatNumber 指定小数位数格式化', () => {
    expect(formatNumber(1234567890.9876, 2)).toBe('1,234,567,890.99')
    expect(formatNumber(0, 1)).toBe('0.0')
    expect(formatNumber(1234567890, 2)).toBe('1,234,567,890.00')
  })
  it('formatNumber 指定单位格式化', () => {
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
  })
  it('formatNumber 指定小数位数和单位格式化', () => {
    expect(formatNumber(1234567890.9876, 2, '万')).toBe('1,234,567,890.99万')
    expect(
      formatNumber(1234567890.9876, 2, {
        len: 4,
        unit: '万',
      })
    ).toBe('123,456.79万')
  })
})
