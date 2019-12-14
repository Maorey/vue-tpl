/*
 * @Description: ajax通信
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:56:35
 */
import AXIOS from 'axios'

import CONFIG from '@/config'
import sort from '@/utils/sort'
import clone from '@/utils/clone'
import { Memory } from '@/utils/storage'

// 默认请求配置 https://github.com/axios/axios#config-defaults
clone(AXIOS.defaults, {
  baseURL: CONFIG.baseUrl, // 请求前缀（相对路径时添加）
  timeout: CONFIG.timeout, // 超时

  // 从cookie设置请求头
  // xsrfCookieName: CONFIG.token,
  // xsrfHeaderName: CONFIG.token,

  // 允许跨域带cookie
  // 服务端需要设置响应头Allow-Credentials=true Allow-Origin不能为* 还得设置下Allow-Methods
  // withCredentials: true,

  responseType: 'json', // 响应类型

  // 请求头
  // headers: {
  //   common: {
  //     'Content-Type': 'application/json;charset=utf-8',
  //   },
  // },

  // 缓存配置
  // noCache: true, // 该请求不缓存响应 默认:false
  // alive: 0, // 该请求响应缓存最大存活时间 默认:CONFIG.apiCacheAlive
})

/** 请求队列 相同请求只允许一个pending
 */
const requestQueue = new Memory()
/** get请求响应缓存
 */
const dataStore = new Memory(CONFIG.apiMaxCache, CONFIG.apiCacheAlive)

/// 【debug】带上特定查询字段 ///
let SEARCH: IObject | undefined
location.search
  .replace(/\/$/, '')
  .replace(
    new RegExp(`[?&](${process.env.SEARCH_FIELD})=([^&]*)`, 'g'),
    (match, field, value) => {
      value && ((SEARCH || (SEARCH = {}))[field] = value)
      return match
    }
  )

function toString(value: any) {
  switch (typeof value) {
    case 'object':
      return JSON.stringify(value)
    default:
      return String(value)
  }
}
function searchToObj(search: string) {
  const Obj: IObject<string> = {}
  let param: string | string[]
  for (param of search.split('&')) {
    // param = decodeURIComponent(param)
    param = param.split('=')
    Obj[param[0]] = param[1]
  }
  return Obj
}
function getKEY(url: string, params?: IObject) {
  const part = url.split('?') // 提取查询参数
  // 处理查询参数
  let query = part[1]
  query && (params = clone(searchToObj(query), params))
  query = '.'

  // 按key升序排列 拼接字符
  if (params) {
    for (const key of sort(Object.keys(params))) {
      query += `${key}.${toString(params[key])}.`
    }
  }

  return part[0] + query
}

/** 发起请求
 * @param {String} url 请求地址
 * @param {String} method http方法
 * @param {Object} params 查询参数
 * @param {Object} data 请求数据
 * @param {Object} config 请求配置【添加到响应的meta字段】
 *
 * @returns {Promise} 响应
 */
function request(
  url: string,
  method: string,
  params?: IObject,
  data?: any,
  config: IObject = {}
): Promise<any> {
  config.url = url
  config.method = method
  data && (config.data = data)
  params && (config.params = params)

  const KEY = getKEY(config.url, config.params) // 请求标识

  // 正在请求队列【全局避免多次重复请求】
  let cache = requestQueue.get(KEY)
  if (cache) {
    return cache
  }

  const shouldCache =
    !(SEARCH && Object.assign(config.params || (config.params = {}), SEARCH)) &&
    !config.noCache &&
    config.method === 'get'
  // 使用缓存的get请求
  if (shouldCache) {
    cache = dataStore.get(KEY)
    if (cache) {
      return Promise.resolve(cache)
    }
  } else {
    dataStore.remove(KEY)
  }

  return requestQueue.set(
    KEY,
    AXIOS.request(config)
      .then((res: any) => {
        res.meta = config
        shouldCache && dataStore.set(KEY, res, config.alive) // 设置缓存
        requestQueue.remove(KEY) // 移除请求队列
        /// 响应拦截 ///
        return res
      })
      .catch((res: any) => {
        res.meta = config
        requestQueue.remove(KEY) // 移除请求队列
        /// 错误拦截 ///
        throw res
      })
  )
}

/// http 方法: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods ///
/** get请求(获取资源)
 * @param {String} url 请求地址
 * @param {Object} params 查询参数
 * @param {Object} config 请求配置
 *
 * @returns {Promise} 响应
 */
function get(url: string, params?: IObject, config?: IObject): Promise<any> {
  return request(url, 'get', params, null, config)
}
/** delete请求(删除资源)
 * @param {String} url 请求地址
 * @param {Object} params 查询参数
 * @param {Object} config 请求配置
 *
 * @returns {Promise} 响应
 */
function del(url: string, params?: IObject, config?: IObject): Promise<any> {
  return request(url, 'delete', params, null, config)
}
/** put请求(覆盖资源)
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} params 查询参数
 * @param {Object} config 请求配置
 *
 * @returns {Promise} 响应
 */
function put(
  url: string,
  data: any,
  params?: IObject,
  config?: IObject
): Promise<any> {
  return request(url, 'put', params, data, config)
}
/** post请求(创建资源)
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} params 查询参数
 * @param {Object} config 请求配置
 *
 * @returns {Promise} 响应
 */
function post(
  url: string,
  data: any,
  params?: IObject,
  config?: IObject
): Promise<any> {
  return request(url, 'post', params, data, config)
}
/** patch请求(部分覆盖资源)
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} params 查询参数
 * @param {Object} config 请求配置
 *
 * @returns {Promise} 响应
 */
function patch(
  url: string,
  data: any,
  params?: IObject,
  config?: IObject
): Promise<any> {
  return request(url, 'patch', params, data, config)
}

/** 全局请求头配置【只用于携带token等】
 */
let HEADERS = AXIOS.defaults.headers || (AXIOS.defaults.headers = {})
HEADERS = HEADERS.common || (HEADERS.common = {})

export { get, del, put, post, patch, HEADERS as default }
