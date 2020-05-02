/** 阿拉伯数字转中文数字(最高支持描述万万亿)
 * @test true
 *
 * @param {string|number} number 阿拉伯数字
 * @param {number} describe 描述 默认:使用描述 1:不使用描述 2:不使用描述且保留开头的0
 * @param {number} cases 大小写 默认:中文小写 1:中文小写但是使用大写零 2:中文大写
 *
 * @returns {string} 中文数字
 */
export default function(
  number: string | number,
  describe?: 0 | 1 | 2,
  cases?: 0 | 1 | 2
) {
  if (!number && number !== 0) {
    return ''
  }

  let NUM: string // 数字
  let UNIT: string // 单位
  let ZERO: string
  let TRIM_BEFORE: RegExp // 去开头的0和单位
  if (cases === 2) {
    ZERO = '零'
    NUM = '零壹贰叁肆伍陆柒捌玖'
    UNIT = '拾佰仟万拾佰仟亿拾佰仟万拾佰仟'
    TRIM_BEFORE = /^零*[拾佰仟万亿]*零*/
  } else {
    ZERO = cases ? '零' : '〇'
    NUM = ZERO + '一二三四五六七八九'
    UNIT = '十百千万十百千亿十百千万十百千'
    TRIM_BEFORE = new RegExp(`^${ZERO}*[十百千万亿]*${ZERO}*`)
    cases = 0 // 标识小写
  }
  const GOLD = '亿' // 最大单位
  const SILVER = '万' // 溢出单位 一二万万亿
  const POINT = '点'
  const SIGN = { '+': '正', '-': '负' }
  const LEN_UNIT = 15 // UNIT.length
  const SILVER_POS = 11 // 万的最后位置 十万亿

  return String(number).replace(
    /([+-])?(\d+)(\.\d+)?/g,
    (char, sign: '+' | '-', integer: string, unit: string) => {
      let cn = ''

      let index
      // 小数部分(保留末尾0)
      if (unit) {
        index = unit.length
        while (--index) {
          cn = NUM[unit[index] as any] + cn
        }
        cn = POINT + cn
      }

      let pos
      number = -1 // [-1, LEN_UNIT)
      index = integer.length
      // 整数部分
      while (index--) {
        char = NUM[integer[index] as any]
        if (!describe) {
          if (number < LEN_UNIT) {
            // 未超过最大可描述数值
            unit = UNIT[number++] || ''
            if (ZERO === char) {
              if ((pos = UNIT.indexOf((char = cn[0]))) >= 0) {
                if (number > SILVER_POS && char === GOLD) {
                  // 万亿
                  char = unit
                } else if (pos < UNIT.indexOf(unit)) {
                  // 替换上大的单位
                  char = unit
                  cn = cn.substring(1)
                } else {
                  char = ''
                }
              } else {
                // POINT falsy ...
                char = NUM.indexOf(char) > 0 ? unit + ZERO : unit
              }
            } else if (unit) {
              ;(pos = UNIT.indexOf(cn[0])) >= 0 &&
                pos < UNIT.indexOf(unit) &&
                (cn = cn.substring(1))
              char += unit
            }
          } else if (number === LEN_UNIT) {
            number++ // 使只执行一次
            cn = SILVER + cn
          }
        }

        cn = char + cn
      }

      if (describe !== 2) {
        char = cn[0] // 兼职首字
        if (!char || char === POINT) {
          cn = ZERO + cn // 补0 0/0.1
        } else {
          if (char === ZERO || UNIT.indexOf(char) >= 0) {
            // 去0及单位开头的
            unit = describe || number > LEN_UNIT ? '' : ZERO
            cn = cn.replace(TRIM_BEFORE, unit) || ZERO
            unit && (unit = cn[1]) && unit !== POINT && (cn = cn.substring(1))
          }
          // 0 及 一十* => 十*
          ZERO === cn
            ? (sign = 0 as any)
            : cases ||
              (char === NUM[1] && cn[1] === UNIT[0] && (cn = cn.substring(1)))
        }
      }

      // 加正负号
      return (SIGN[sign] || '') + cn
    }
  )
}
