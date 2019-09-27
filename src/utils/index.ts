/*
 * @Description: 工具函数库
 * @Author: 毛瑞
 * @Date: 2019-06-19 16:10:48
 */
import sort from './utils/sort'
import clone from './utils/clone'
import formatNumber from './utils/formatNumber'
import formatDate, { getDateByString } from './utils/formatDate'
import { toRGB, isTransparent, fitColor, reverseColor } from './utils/color'
import { getOffset, getInfoByHtml, escapeHTML, HtmlInfo } from './utils/dom'
import {
  getStyleByName,
  styleToObject,
  objectToStyle,
  updateStyle,
} from './utils/style'
import {
  camelToKebab,
  camelToUpper,
  kebabToCamel,
  kebabToUpper,
  upperToCamel,
  UpperTokebab,
} from './utils/case'

export {
  sort,
  clone,
  formatNumber,
  formatDate,
  getDateByString,
  toRGB,
  isTransparent,
  fitColor,
  reverseColor,
  getOffset,
  getInfoByHtml,
  escapeHTML,
  HtmlInfo,
  camelToKebab,
  camelToUpper,
  kebabToCamel,
  kebabToUpper,
  upperToCamel,
  UpperTokebab,
  getStyleByName,
  styleToObject,
  objectToStyle,
  updateStyle,
}
