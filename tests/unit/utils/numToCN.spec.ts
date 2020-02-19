/** 阿拉伯数字转中文数字
 */
import numToCN from '@/utils/numToCN'
describe('@/utils/numToCN: 阿拉伯数字和中文转换', () => {
  it('numToCN: 阿拉伯数字转中文数字', () => {
    expect(numToCN('')).toBe('')

    expect(numToCN(0)).toBe('〇')
    expect(numToCN('00')).toBe('〇')
    expect(numToCN('+000000')).toBe('〇')
    expect(numToCN('-0000000000')).toBe('〇')
    expect(numToCN('00000000000000000')).toBe('〇')

    expect(numToCN(-0.1)).toBe('负〇点一')
    expect(numToCN(0.01)).toBe('〇点〇一')
    expect(numToCN('0.01230')).toBe('〇点〇一二三〇')
    expect(numToCN('-00000.01200')).toBe('负〇点〇一二〇〇')

    expect(numToCN(2)).toBe('二')
    expect(numToCN('+2')).toBe('正二')
    expect(numToCN(-2)).toBe('负二')
    expect(numToCN('+ 2')).toBe('+ 二')
    expect(numToCN('- 2')).toBe('- 二')

    expect(numToCN('测试')).toBe('测试')
    expect(numToCN('测试2')).toBe('测试二')
    expect(numToCN('测试2和测试-2')).toBe('测试二和测试负二')

    expect(numToCN(10)).toBe('十')
    expect(numToCN(12)).toBe('十二')

    expect(numToCN(100)).toBe('一百')
    expect(numToCN(120)).toBe('一百二十')
    expect(numToCN(103)).toBe('一百〇三')

    expect(numToCN(1000)).toBe('一千')
    expect(numToCN(1004)).toBe('一千〇四')
    expect(numToCN(1030)).toBe('一千〇三十')
    expect(numToCN(1200)).toBe('一千二百')

    expect(numToCN(10000)).toBe('一万')
    expect(numToCN(10005)).toBe('一万〇五')
    expect(numToCN(10040)).toBe('一万〇四十')
    expect(numToCN(10045)).toBe('一万〇四十五')
    expect(numToCN(10300)).toBe('一万〇三百')
    expect(numToCN(10305)).toBe('一万〇三百〇五')
    expect(numToCN(10340)).toBe('一万〇三百四十')
    expect(numToCN(10345)).toBe('一万〇三百四十五')
    expect(numToCN(12000)).toBe('一万二千')
    expect(numToCN(12005)).toBe('一万二千〇五')
    expect(numToCN(12040)).toBe('一万二千〇四十')
    expect(numToCN(12045)).toBe('一万二千〇四十五')
    expect(numToCN(12300)).toBe('一万二千三百')
    expect(numToCN(12305)).toBe('一万二千三百〇五')
    expect(numToCN(12340)).toBe('一万二千三百四十')
    expect(numToCN(12345)).toBe('一万二千三百四十五')

    expect(numToCN(100006)).toBe('十万〇六')
    expect(numToCN(120406)).toBe('十二万〇四百〇六')
    expect(numToCN(1004067)).toBe('一百万〇四千〇六十七')
    expect(numToCN(1014067)).toBe('一百〇一万四千〇六十七')
    expect(numToCN(123456789000000)).toBe(
      '一百二十三万四千五百六十七亿八千九百万'
    )
    expect(numToCN('012345678909876543210')).toBe(
      '一二三四万五千六百七十八万九千〇九十八亿七千六百五十四万三千二百一十'
    )

    expect(numToCN('012345.67890', 1)).toBe('一二三四五点六七八九〇')
    // expect(numToCN('.7890', 2)).toBe('点七八九〇')
    expect(numToCN('0123456.7890', 2)).toBe('〇一二三四五六点七八九〇')
    expect(numToCN('-012345678909876543210.1', 1)).toBe(
      '负一二三四五六七八九〇九八七六五四三二一〇点一'
    )

    expect(numToCN('012345.67890', 0, 1)).toBe('一万二千三百四十五点六七八九零')
    expect(numToCN('0123456.7890', 0, 2)).toBe(
      '壹拾贰万叁仟肆佰伍拾陆点柒捌玖零'
    )
    expect(numToCN('-012345678909876543210.1', 0, 2)).toBe(
      '负壹贰叁肆万伍仟陆佰柒拾捌万玖仟零玖拾捌亿柒仟陆佰伍拾肆万叁仟贰佰壹拾点壹'
    )

    expect(numToCN('012345.67890', 1, 1)).toBe('一二三四五点六七八九零')
    expect(numToCN('0123456.7890', 1, 2)).toBe('壹贰叁肆伍陆点柒捌玖零')
    expect(numToCN('-012345678909876543210.1', 1, 2)).toBe(
      '负壹贰叁肆伍陆柒捌玖零玖捌柒陆伍肆叁贰壹零点壹'
    )

    expect(numToCN('012345.67890', 2, 1)).toBe('零一二三四五点六七八九零')
    expect(numToCN('0123456.7890', 2, 2)).toBe('零壹贰叁肆伍陆点柒捌玖零')
    expect(numToCN('-012345678909876543210.1', 2, 2)).toBe(
      '负零壹贰叁肆伍陆柒捌玖零玖捌柒陆伍肆叁贰壹零点壹'
    )
  })
})
