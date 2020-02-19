/** 阿拉伯数字转中文数字(最高支持描述万万亿)
 * @param {string|number} number 阿拉伯数字
 * @param {number} unit 1: 不需要单位 2: 不需要单位并且保留开头的0
 *
 * @returns {string} 中文数字
 */
export default function numToCN(number: string | number, noUnit?: 1 | 2) {
  if (!number && number !== 0) {
    return ''
  }

  const POINT = '点'
  const NUM = '零一二三四五六七八九'
  const UNIT = '十百千万十百千亿十百千万十百千'
  const SIGN = { '+': '正', '-': '负' }
  const LEN_UNIT = 15 // UNIT.length
  const ZERO = '零' // NUM[0]
  const UNIT_MAX = '亿' // 最大单位
  const TRIPLE = '万' // 溢出单位 一二万万亿
  const TRIPLE_POS = 11 // 万的最后位置 十万亿
  const TRIM_BEFORE = /^零*[十百千万亿]*/ // 去开头的0和单位
  return String(number).replace(
    /([+-])?(\d+)(\.\d+)?/g,
    (match, sign: '+' | '-', integer: string, decimal: string) => {
      let result = ''

      let index
      // 小数部分(保留末尾0)
      if (decimal) {
        index = decimal.length
        while (--index) {
          result = NUM[decimal[index] as any] + result
        }
        result = POINT + result
      }

      let char
      let unit
      let pos
      let indexUnit = -1 // [-1, LEN_UNIT)
      index = integer.length
      // 整数部分
      while (index--) {
        char = NUM[integer[index] as any]
        if (!noUnit) {
          if (indexUnit < LEN_UNIT) {
            // 未超过最大可描述数值
            unit = UNIT[indexUnit++] || ''
            if (ZERO === char) {
              char = result[0]
              switch (char) {
                case (pos = UNIT.indexOf(char)) >= 0 && char:
                  // 替换上大的单位
                  if (indexUnit > TRIPLE_POS && char === UNIT_MAX) {
                    // 万亿
                    char = unit
                  } else if ((pos as any) < UNIT.indexOf(unit)) {
                    char = unit
                    result = result.substring(1)
                  } else {
                    char = ''
                  }
                  break

                default:
                  // ZERO POINT falsy ...
                  char = NUM.indexOf(char) > 0 ? unit + ZERO : unit
              }
            } else if (unit) {
              ;(pos = UNIT.indexOf(result[0])) >= 0 &&
                pos < UNIT.indexOf(unit) &&
                (result = result.substring(1))
              char += unit
            }
          } else if (indexUnit === LEN_UNIT) {
            indexUnit++ // 使只执行一次
            result = TRIPLE + result
          }
        }

        result = char + result
      }

      char = result[0] // 兼职首字
      if (!char || char === POINT) {
        // 补零 0/0.1
        result = ZERO + result
      } else if (char === NUM[1] && result[1] === UNIT[0]) {
        // 一十* => 十*
        result = result.substring(1)
      } else if (noUnit !== 2 && (char === ZERO || UNIT.indexOf(char) >= 0)) {
        // 去零及单位开头的
        ZERO ===
          (result =
            result.replace(
              TRIM_BEFORE,
              noUnit || indexUnit > LEN_UNIT ? '' : ZERO
            ) || ZERO) && (sign = 0 as any)
      }
      // 加正负号
      return (SIGN[sign] || '') + result
    }
  )
}
