/*
 * @Description: 颜色处理
 * @Author: 毛瑞
 * @Date: 2019-07-03 14:48:49
 */
import { isNumber } from '.'
/** 透明度回调
 * @param {Number} alpha 透明度
 *
 * @returns {Number|Any}
 */
type Alpha = (alpha: number) => number | any
/** 颜色/透明度过滤器
 * @param {Array<Number>} rgb rgb 色值(直接修改该数组)
 * @param {Number} alpha 透明度
 *
 * @returns {Number|Any} 返回非NaN数字则修改透明度
 */
type Filter = (rgb: number[], alpha: number) => number | any

/** hex3/hex颜色 */
const REG_HEX = /#([0-9a-f]{3,8})/i
/** rgb/rgba颜色 */
const REG_RGB = /rgba?\s*\(\s*(\d+\s*,\s*\d+\s*,\s*\d+)\s*,?\s*(\d+\.?\d+?)?\s*\)/i
/** 转为10进制整数
 *    parseInt(string, radix)
 *    Number.prototype.toString(radix) 数字toString可以设置进制,默认10
 */
const PARSEINT = (str: string) => parseInt(str)
/** 颜色转rgb(a)
 * @test true
 *
 * @param {String} color rgb\rgba\hex\hex3 颜色
 * @param {Number|Function} opacity 要设置的透明度，若回调则接受当前值返回新值
 *   [0 - 1] 小于0视为0 大于等于1返回rgb 其它保留原透明度
 * @param {Function} filter 自定义颜色处理方法 直接修改rgb数组 返回透明度
 *
 * @returns {String} rgb(a) 颜色
 */
function toRGB(
  color: string,
  opacity?: number | null | Alpha,
  filter?: Filter
) {
  color = color.trim()
  // 非字符串或空字符串返回空字符串
  if (!color) {
    return color
  }

  // 颜色名对应
  color === 'transparent' && (color = 'rgba(0,0,0,0)')

  let rgb: number[] // rgb色值数组
  let alpha = NaN // 透明度
  let tmp: any // 临时变量

  /// hex3/hex颜色处理 ///
  tmp = REG_HEX.exec(color)
  if (tmp) {
    rgb = []
    for (
      let i = 0, val = tmp[1], len = val.length, step = len < 5 ? 1 : 2;
      i < len;
      i += step
    ) {
      tmp = val.substring(i, i + step)
      // 16进制转10进制 不足2位的补足 比如 'f' => 'ff'
      // rgb.push(parseInt('0x' + tmp.padEnd(2, tmp)))
      rgb.push(parseInt('0x' + (tmp.length < 2 ? tmp + tmp : tmp)))
    }

    // 去掉数组超过三个的并得到透明度，无透明度为NaN
    alpha = rgb.splice(3)[0] * 0.0039 // hex透明度:0（0%）到255（100%）
  } else {
    /// rgb/rgba颜色处理 ///
    tmp = REG_RGB.exec(color)
    if (tmp) {
      // 色值整数
      rgb = tmp[1].split(',').map(PARSEINT)
      alpha = parseFloat(tmp[2]) // 无透明度为NaN
    } else {
      // 不支持的字符串原样返回
      return color
    }
  }

  // 透明度处理
  if (isNumber(opacity)) {
    alpha = opacity
  } else if (opacity) {
    alpha = opacity(isNaN(alpha) ? 1 : alpha)
  }
  alpha = isNaN(alpha) ? 1 : Math.max(0, alpha) // 使大于等于0

  // 自定义颜色处理
  if (filter) {
    tmp = filter(rgb, alpha)
    isNaN(tmp) || (alpha = tmp)
  }

  return alpha < 1
    ? 'rgba(' + rgb.toString() + ',' + alpha.toFixed(2) + ')'
    : 'rgb(' + rgb.toString() + ')'
}

/** 颜色是否透明
 * @test true
 *
 * @param {String} color rgb\rgba\hex\hex3 颜色
 *
 * @returns {Boolean}
 */
function isTransparent(color: string) {
  let transparent = true

  toRGB(color, (alpha: number) => {
    transparent = alpha <= 0
  })

  return transparent
}

/** 自适应颜色
 * @param {String} color rgb\rgba\hex\hex3 颜色
 * @param {Number} ratio [0, 1] 越接近1与原颜色越相似
 * @param {Number|Function} opacity 要设置的透明度，若回调则接受当前值返回新值
 * [0 - 1] 小于0视为0 大于等于1返回rgb 其它保留原透明度
 *
 * @returns {String} rgb(a) 颜色
 */
function fitColor(
  color: string,
  ratio?: number,
  opacity?: number | null | Alpha
) {
  ratio || ratio === 0 || (ratio = 0.25)
  return toRGB(color, opacity, (rgb: number[]) => {
    let value: number
    let i = 3
    while (i--) {
      value = rgb[i]
      rgb[i] =
        value +
        (value > 88
          ? -Math.floor(value * (ratio as number)) // 加深
          : Math.floor((255 - value) * (ratio as number))) // 变浅
    }
  })
}

const FILLER_REVERSE = (rgb: number[]) => {
  let i = 3
  while (i--) {
    rgb[i] = 255 - rgb[i]
  }
}
/** 计算反色
 * @test true
 *
 * @param {String} color rgb\rgba\hex\hex3 颜色
 * @param {Function} filter 自定义颜色处理方法 直接修改rgb数组 返回透明度
 * @param {Number|Function} opacity 要设置的透明度[0 - 1] 小于0视为0 大于等于1返回rgb 其它保留原透明度
 *
 * @returns {String} rgb(a) 颜色
 */
function reverseColor(
  color: string,
  filter?: Filter,
  opacity?: number | null | Alpha
) {
  return toRGB(color, opacity, filter || FILLER_REVERSE)
}

export { toRGB, isTransparent, fitColor, reverseColor }
