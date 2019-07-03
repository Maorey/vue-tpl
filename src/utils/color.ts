/*
 * @Description: 颜色处理
 * @Author: 毛瑞
 * @Date: 2019-07-03 14:48:49
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-03 17:32:01
 */

const REG_HEX = /#([0-9a-f]{3,8})/i // hex3/hex颜色
// rgb/rgba颜色
const REG_RGB = /rgba? *\( *(\d+ *, *\d+ *, *\d+) *,? *(\d+\.?\d+?)? *\)/i
/** 颜色转rgb(a)
 * @param {String} color rgb\rgba\hex\hex3 颜色
 * @param {Number|Function} opacity 要设置的透明度，若回调则接受当前值返回新值
 * [0 - 1] 小于0视为0 大于等于1返回rgb 其它保留原透明度
 * @param {Function} filter 自定义颜色处理方法 接受参数为rgb色值数组，应返回或直接修改该数组
 *
 * @returns {String}
 */
function toGRB(
  color: string,
  opacity: number | ((alpha: number) => number | any) = 1,
  filter?: (rgba: number[]) => number[] | void
): string {
  color = color.trim()
  // 非字符串或空字符串返回空字符串
  if (!color) {
    return color
  }

  // 颜色名对应
  if (color === 'transparent') {
    color = 'rgba(0,0,0,0)'
  }

  let rgb: number[] // rgb色值数组
  let alpha: number = NaN // 透明度
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
      // substr 不推荐使用了
      tmp = val.substring(i, i + step)
      // 16进制转10进制
      // 不足2位的补足 比如 'f' => 'ff'
      // rgb.push(parseInt('0x' + tmp.padEnd(2, tmp)))
      // 为了兼容
      rgb.push(parseInt('0x' + (tmp.length < 2 ? tmp + tmp : tmp)))
    }

    // 去掉数组超过三个的并得到透明度，无透明度为NaN
    // hex的透明度也是0（0%）到255（100%）
    alpha = rgb.splice(3)[0] * 0.0039
  } else {
    /// rgb/rgba颜色处理 ///
    tmp = REG_RGB.exec(color)
    if (tmp) {
      // 色值整数
      rgb = tmp[1].split(',').map((str: string) => parseInt(str))
      alpha = parseFloat(tmp[2]) // 无透明度为NaN
    } else {
      // 不支持的字符串原样返回
      return color
    }
  }

  // 透明度处理
  if (opacity !== undefined) {
    if (typeof opacity === 'function') {
      alpha = opacity(isNaN(alpha) ? 1 : alpha)
    } else {
      alpha = opacity
    }
  }
  alpha = isNaN(alpha) ? 1 : Math.max(0, alpha) // 使大于等于0

  // 自定义颜色处理
  if (filter) {
    tmp = filter([...rgb, alpha])
    if (tmp) {
      alpha = tmp.pop()
      rgb = tmp
    }
  }

  if (alpha < 1) {
    // 有透明度
    return 'rgba(' + rgb.toString() + ',' + alpha.toFixed(2) + ')'
  }
  return 'rgb(' + rgb.toString() + ')'
}

export { toGRB }
