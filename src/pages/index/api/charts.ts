import { get as xhrGet } from '@/utils/ajax'
import API from '@index/config/api/charts'

/** 获取饼图数据
 * @param {boolean} noCache 禁用缓存
 * @param {IObject} params
 *
 * @returns {Promise}
 */
function pie(noCache?: boolean, params?: IObject) {
  return xhrGet(API.line, params, { noCache })
}

/** 获取柱图数据
 * @param {boolean} noCache 禁用缓存
 * @param {IObject} params
 *
 * @returns {Promise}
 */
function line(noCache?: boolean, params?: IObject) {
  return xhrGet(API.pie, params, { noCache })
}

export { pie, line }
