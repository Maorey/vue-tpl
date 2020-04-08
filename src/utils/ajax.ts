/*
 * @Description: ajax通信
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:56:35
 */
import AXIOS from 'axios'
import combineURLs from 'axios/lib/helpers/combineURLs'

import CONFIG from '@/config'
import sort from '@/utils/sort'
import clone from '@/utils/clone'
import { Memory } from '@/utils/storage'

// import { success, failed } from './interceptor' // [请求拦截]
// import { emit } from '../eventBus' // 通知取消请求 以便自定义取消策略使用

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

  // 缓存配置[避免使用axios的配置项]
  // key?: string, // 请求标识【相同key视为相同请求】
  // noCache: true, // 该请求不缓存响应 默认:false
  // alive: 0, // 该请求响应缓存最大存活时间 默认:CONFIG.apiCacheAlive
})

/** 请求队列 */
const requestQueue = new Memory()
/** 【get】响应缓存 */
const dataStore = new Memory(CONFIG.apiMaxCache, CONFIG.apiCacheAlive)

/** 取消请求 https://github.com/axios/axios#cancellation
 *    创建一次token只能用对应的cancel一次, 不能复用
 */
const CancelToken = AXIOS.CancelToken
/** 是否被取消 */
const isCancel = AXIOS.isCancel

/** 【debug】带上特定查询字段 */
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

/** 全局请求头配置【只用于携带token等】 */
let HEAD = AXIOS.defaults.headers || (AXIOS.defaults.headers = {})
HEAD = HEAD.common || (HEAD.common = {})

/** 获取url (直接使用url的情况, 比如验证码、下载、上传等, 添加BaseUrl、调试参数等)
 * @param {string} url
 * @param {IObject} params 查询参数
 */
function getUri(url: string, params?: IObject) {
  return combineURLs(
    AXIOS.defaults.baseURL,
    AXIOS.getUri({
      url,
      params: SEARCH ? Object.assign(params || {}, SEARCH) : params,
    })
  )
}

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
/** 获取请求标识
 * @param url 请求地址
 * @param params 查询参数
 */
function getKey(url: string, params?: IObject) {
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
 * @param {Object} config [复用]请求配置【===响应.meta】
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
  config.key || (config.key = getKey(config.url, config.params)) // 请求标识

  // 在请求队列
  let cache = requestQueue.get(config.key)
  if (cache) {
    return cache
  }

  const shouldCache =
    !(SEARCH && Object.assign(config.params || (config.params = {}), SEARCH)) &&
    !config.noCache &&
    config.method === 'get'
  // 使用缓存的get请求
  if (shouldCache) {
    cache = dataStore.get(config.key)
    if (cache) {
      return Promise.resolve(cache)
    }
  } else {
    dataStore.remove(config.key)
  }

  // 用于取消请求 [不划算]
  // if ((data = !config.cancelToken)) {
  // data = CancelToken.source()
  // config.cancelToken = data.token
  // data = data.cancel
  // }

  cache = AXIOS.request(config)
    .then((res: any) => {
      if (config._$c) {
        res = config._$c // 自定义取消标记
        config._$c = 0 // 只取消一次
        throw res
      }

      res.meta = config // 请求配置加到元数据
      requestQueue.remove(config.key) // 移除请求队列
      shouldCache && dataStore.set(config.key, res, config.alive) // 设置缓存

      return res // success(res) // [请求拦截]
    })
    .catch((res: any) => {
      res.meta = config // 请求配置加到元数据
      requestQueue.remove(config.key) // 移除请求队列
      // if (isCancel(res)) {
      //   throw res
      // } else if (config._$c) {
      //   res = config._$c // 自定义取消标记
      //   config._$c = 0 // 只取消一次
      //   throw res
      // } else {
      //   failed(res) // [请求拦截]
      // }
      if (config._$c) {
        res = config._$c // 自定义取消标记
        config._$c = 0 // 只取消一次
      }
      throw res
    })

  // data && (cache.cancel = data) // [不划算]

  // 经济版取消(不执行then)
  config.cancelToken ||
    (cache.cancel = (reason = '取消请求') => {
      config._$c = new Error(reason)
      config._$c.__CANCEL__ = 1 // for AXIOS.isCancel
    })

  return requestQueue.set(config.key, cache)
}

/// http 方法: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods ///
/** get请求(获取资源)
 * @param {String} url 请求地址
 * @param {Object} params 查询参数
 * @param {Object} config [复用]请求配置【===响应.meta】
 *
 * @returns {Promise} 响应
 */
function get(url: string, params?: IObject, config?: IObject): Promise<any> {
  return request(url, 'get', params, null, config)
}
/** delete请求(删除资源)
 * @param {String} url 请求地址
 * @param {Object} params 查询参数
 * @param {Object} config [复用]请求配置【===响应.meta】
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
 * @param {Object} config [复用]请求配置【===响应.meta】
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
 * @param {Object} config [复用]请求配置【===响应.meta】
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
 * @param {Object} config [复用]请求配置【===响应.meta】
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

/** 取消所有队列中的请求(自定义取消的除外) [经济版(不执行then)]
 * @param {string} reason 取消请求原因
 */
function cancel(reason?: string) {
  for (
    let i = 0, pool = requestQueue.pool, len = pool.length, item;
    i < len;
    i++
  ) {
    if ((item = pool[i]).v.cancel) {
      i--
      len--
      item.v.cancel(reason)
      requestQueue.remove(item.k)
    }
  }
}

export {
  CancelToken,
  isCancel,
  HEAD,
  getUri,
  getKey,
  get,
  del,
  put,
  post,
  patch,
  cancel,
}
