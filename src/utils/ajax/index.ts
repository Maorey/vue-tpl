/* ajax 通信 */
import AXIOS, { AxiosRequestConfig, Method } from 'axios'
import combineURLs from 'axios/lib/helpers/combineURLs'

import CONFIG from '@/config'
// import { AUTH } from '@/enums'
import { success, failed } from '@/functions/interceptor'

import clone from '../clone'
import { Memory } from '../storage'
import WS from './websocket'
// import { emit } from '../eventBus' // 通知取消请求 以便自定义取消策略使用

// 默认请求配置 https://github.com/axios/axios#config-defaults
clone(AXIOS.defaults, {
  timeout: CONFIG.timeout, // 超时

  // 从cookie设置请求头
  // xsrfCookieName: AUTH.cookie,
  // xsrfHeaderName: AUTH.head,

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
})

/** 请求配置 */
interface RequestConfig extends AxiosRequestConfig {
  /** 请求标识【相同key视为相同请求, 默认:[url, method, query, data]】 */
  key?: any
  /** 是否【不缓存响应】, get默认false, 其他默认true */
  noCache?: boolean
  /** 响应缓存最大存活时间, 默认:CONFIG.apiCacheAlive */
  alive?: number
}

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

/** 取消请求 https://github.com/axios/axios#cancellation
 *    创建一次token只能用对应的cancel一次, 不能复用
 */
const CancelToken = AXIOS.CancelToken
/** 是否被取消 */
const isCancel = AXIOS.isCancel

/** 设置【全局】请求路径
 * @param baseURL 所有非http开头的请求添加的前缀
 */
function setBase(baseURL: string) {
  AXIOS.defaults.baseURL = baseURL
}

/** 全局请求头配置【只用于携带token等】 */
let HEAD = AXIOS.defaults.headers || (AXIOS.defaults.headers = {})
HEAD = HEAD.common || (HEAD.common = {})

/** 设置【全局】请求头
 * @param headOrKey
 * @param value
 * @param isToken
 */
function setHEAD(head: IObject): void
function setHEAD(name: string, value: string, isToken?: boolean): void
function setHEAD(
  headOrKey: IObject | string,
  value?: string,
  isToken?: boolean
) {
  if (value) {
    HEAD[headOrKey as string] = value
    isToken && (WS.defaults.protocols = [value]) // websocket 授权
  } else {
    Object.assign(HEAD, headOrKey as IObject)
  }
}

/** 获取url (直接使用url的情况, 比如验证码、下载、上传等, 添加BaseUrl、调试参数等)
 * @param {string} url
 * @param {IObject} query 查询参数
 */
function getUri(url: string, query?: IObject) {
  return combineURLs(
    AXIOS.defaults.baseURL || '',
    AXIOS.getUri({
      url,
      params: SEARCH ? Object.assign(query || {}, SEARCH) : query,
    })
  )
}

const requestQueue = new Memory()
const dataStore = new Memory(CONFIG.apiMaxCache, CONFIG.apiCacheAlive)

/** 发起请求
 * @param {String} url 请求地址
 * @param {Method} method http方法
 * @param {Object} query 查询参数
 * @param {Object} data 请求数据
 * @param {RequestConfig} config [引用]请求配置【===响应.meta】
 *
 * @returns {Promise} 响应
 */
function request(
  url: string,
  method: Method,
  query?: IObject | null,
  data?: any,
  config?: RequestConfig | null
): Promise<any> {
  config || (config = {})
  config.url = url
  config.method = method
  data && (config.data = data)
  query && (config.params = query)
  config.key || (config.key = [url, method, query, data]) // 请求标识

  let cache = requestQueue.get(config.key)
  if (cache) {
    return cache
  }

  const shouldCache =
    !(SEARCH && Object.assign(config.params || (config.params = {}), SEARCH)) &&
    (config.method === 'get' ? !config.noCache : config.noCache === false)
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
      shouldCache &&
        dataStore.set((config as any).key, res, (config as any).alive) // 设置缓存
      if ((config as any).$_) {
        res = (config as any).$_ // 自定义取消标记
        ;(config as any).$_ = 0 // 只取消一次
        throw res
      }
      requestQueue.remove((config as any).key) // 移除请求队列
      res.meta = config // 请求配置加到元数据
      return success(res)
    })
    .catch((res: any) => {
      requestQueue.remove((config as any).key) // 移除请求队列
      res.meta = config // 请求配置加到元数据
      if (isCancel(res)) {
        throw res
      } else if ((config as any).$_) {
        res = (config as any).$_ // 自定义取消标记
        ;(config as any).$_ = 0 // 只取消一次
        throw res
      } else {
        failed(res)
      }
    })

  // data && (cache.cancel = data) // [不划算]

  // 经济版取消(不执行then)
  config.cancelToken ||
    (cache.cancel = (reason = '取消请求') => {
      ;(config as any).$_ = new Error(reason)
      ;(config as any).$_.__CANCEL__ = 1 // for AXIOS.isCancel
    })

  return requestQueue.set(config.key, cache)
}

/// http 方法: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods ///
/** get请求(获取资源)
 * @param {String} url 请求地址
 * @param {Object} query 查询参数
 * @param {RequestConfig} config [引用]请求配置【===响应.meta】
 *
 * @returns {Promise} 响应
 */
function get(
  url: string,
  query?: IObject | null,
  config?: RequestConfig | null
): Promise<any> {
  return request(url, 'get', query, null, config)
}
/** delete请求(删除资源)
 * @param {String} url 请求地址
 * @param {Object} query 查询参数
 * @param {RequestConfig} config [引用]请求配置【===响应.meta】
 *
 * @returns {Promise} 响应
 */
function del(
  url: string,
  query?: IObject | null,
  config?: RequestConfig | null
): Promise<any> {
  return request(url, 'delete', query, null, config)
}
/** put请求(覆盖资源)
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} query 查询参数
 * @param {RequestConfig} config [引用]请求配置【===响应.meta】
 *
 * @returns {Promise} 响应
 */
function put(
  url: string,
  data?: any,
  query?: IObject | null,
  config?: RequestConfig | null
): Promise<any> {
  return request(url, 'put', query, data, config)
}
/** post请求(创建资源)
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} query 查询参数
 * @param {RequestConfig} config [引用]请求配置【===响应.meta】
 *
 * @returns {Promise} 响应
 */
function post(
  url: string,
  data?: any,
  query?: IObject | null,
  config?: RequestConfig | null
): Promise<any> {
  return request(url, 'post', query, data, config)
}
/** patch请求(部分覆盖资源)
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} query 查询参数
 * @param {RequestConfig} config [引用]请求配置【===响应.meta】
 *
 * @returns {Promise} 响应
 */
function patch(
  url: string,
  data?: any,
  query?: IObject | null,
  config?: RequestConfig | null
): Promise<any> {
  return request(url, 'patch', query, data, config)
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
  setBase,
  HEAD,
  setHEAD,
  getUri,
  get,
  del,
  put,
  post,
  patch,
  cancel,
  WS,
}
