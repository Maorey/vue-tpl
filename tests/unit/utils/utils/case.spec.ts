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
} from '@/utils/utils/case'

test('camelToKebab', () => {
  expect(camelToKebab('camelCase')).toBe('camel-case')
})

test('camelToUpper', () => {
  expect(camelToUpper('camelCase')).toBe('CAMEL_CASE')
})

test('kebabToCamel', () => {
  expect(kebabToCamel('kebab-case')).toBe('kebabCase')
})

test('kebabToUpper', () => {
  expect(kebabToUpper('kebab-case')).toBe('KEBAB_CASE')
})

test('upperToCamel', () => {
  expect(upperToCamel('UPPER_CASE')).toBe('upperCase')
})

test('UpperTokebab', () => {
  expect(UpperTokebab('UPPER_CASE')).toBe('upper-case')
})
