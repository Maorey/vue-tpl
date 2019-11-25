/*
 * @Description: 颜色处理 测试
 * @Author: 毛瑞
 * @Date: 2019-07-03 17:26:45
 */

import { toRGB, isTransparent, reverseColor } from '@/utils/color'

describe('@/utils/color: 颜色处理', () => {
  const HEX1 = '#abc'
  const RGB1 = 'rgb(170,187,204)'
  const RGB1_REVERSE = 'rgb(85,68,51)'

  const HEX2 = '#aabbccdd'
  const RGB2 = 'rgba(170,187,204,0.86)'
  const RGB2_REVERSE = 'rgba(85,68,51,0.86)'

  const REVERSE_FILLER = (rgb: number[]) => {
    let i = 3
    while (i--) {
      rgb[i] = 255 - rgb[i]
    }
  }

  it('toRGB: 转为rgb(a)颜色', () => {
    expect(toRGB(HEX1)).toBe(RGB1)
    expect(toRGB(HEX2)).toBe(RGB2)
    expect(toRGB(' rgba (  1 , 2 , 3 , 0.5 ) ')).toBe('rgba(1,2,3,0.50)')

    const RGBA1 = 'rgba(170,187,204,0.50)'
    expect(toRGB(HEX1, 0.5)).toBe(RGBA1)
    expect(toRGB(HEX1, () => 0.5)).toBe(RGBA1)

    expect(toRGB(HEX1, null, REVERSE_FILLER)).toBe(RGB1_REVERSE)
    expect(toRGB(HEX1, () => 0.5, REVERSE_FILLER)).toBe('rgba(85,68,51,0.50)')
  })

  it('isTransparent: 是否透明色', () => {
    expect(isTransparent(HEX1)).toBe(false)
    expect(isTransparent(HEX2)).toBe(false)
    expect(isTransparent(RGB1_REVERSE)).toBe(false)
    expect(isTransparent(RGB2_REVERSE)).toBe(false)

    expect(isTransparent('transparent')).toBe(true)
    expect(isTransparent('#9870')).toBe(true)
    expect(isTransparent('#abcdef00')).toBe(true)
    expect(isTransparent('rgba(12,34,56,0)')).toBe(true)
  })

  it('reverseColor: 反转颜色', () => {
    expect(reverseColor(HEX1)).toBe(RGB1_REVERSE)
    expect(reverseColor(HEX2)).toBe(RGB2_REVERSE)
  })
})
