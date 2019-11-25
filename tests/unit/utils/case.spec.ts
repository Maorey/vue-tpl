/*
 * @Description: 词语风格转换测试
 * @Author: 毛瑞
 * @Date: 2019-07-04 12:12:42
 */
import {
  camelToKebab,
  camelToUpper,
  kebabToCamel,
  kebabToUpper,
  upperToCamel,
  UpperTokebab,
} from '@/utils/case'

describe('@/utils/case: 词语风格转换', () => {
  it('camelToKebab', () => {
    expect(camelToKebab('camelCase')).toBe('camel-case')
  })

  it('camelToUpper', () => {
    expect(camelToUpper('camelCase')).toBe('CAMEL_CASE')
  })

  it('kebabToCamel', () => {
    expect(kebabToCamel('kebab-case')).toBe('kebabCase')
  })

  it('kebabToUpper', () => {
    expect(kebabToUpper('kebab-case')).toBe('KEBAB_CASE')
  })

  it('upperToCamel', () => {
    expect(upperToCamel('UPPER_CASE')).toBe('upperCase')
  })

  it('UpperTokebab', () => {
    expect(UpperTokebab('UPPER_CASE')).toBe('upper-case')
  })
})
