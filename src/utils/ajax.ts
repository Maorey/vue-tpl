/*
 * @Description: ajax通信
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:56:35
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-04 16:15:17
 */
import AXIOS from 'axios'

import CONFIG from '@/config'
import { clone, quickSort } from '@/utils'
import { Memory } from '@/utils/storage'

import { IObject } from '@/types'

// 默认请求配置 https://github.com/axios/axios#config-defaults
clone(AXIOS.defaults, {
  baseURL: CONFIG.baseUrl, // 请求前缀（相对路径时添加）
  timeout: CONFIG.timeout, // 超时

  // 从cookie设置请求头
  // xsrfCookieName: 'access_token',
  // xsrfHeaderName: 'access_token',

  // 允许跨域带cookie
  // 服务端需要设置响应头Allow-Credentials=true Allow-Origin不能为* 还得设置下Allow-Methods
  // withCredentials: true,

  // responseType: 'json', // 响应类型

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

/** 任意类型转为字符串
 * @param {Any} value 值
 *
 * @returns {String} 字符串
 */
function toString(value: any): string {
  switch (typeof value) {
    case 'object':
      return JSON.stringify(value)
    default:
      return String(value)
  }
}

/** 获得设置存储的KEY url + sorted查询参数 ?a=a&b=b + config.params
 * @param {String} url 资源地址
 * @param {Object<any>} params 查询参数
 */
function getKEY(url: string, params?: IObject<any>): string {
  const part: string[] = url.split('?') // 提取查询参数
  // 处理查询参数
  let query: string = part[1]

  query &&
    (params = clone(
      JSON.parse(`{${query.replace(/&/g, ',').replace(/=/g, ':')}}`),
      params
    ))

  query = '.'
  // 按key升序排列 拼接字符
  if (params) {
    let key: string
    for (key of quickSort(Object.keys(params))) {
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
 * @param {Object} config 请求配置
 *
 * @returns {Promise} 响应
 */
function request(
  url: string,
  method: string,
  params?: IObject<any>,
  data?: any,
  config?: IObject<any>
): Promise<any> {
  config = { ...config }
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
  const shouldCache: boolean = !config.noCache && config.method === 'get'
  // 使用缓存的get请求
  if (shouldCache) {
    cache = dataStore.get(KEY)
    if (cache) {
      return Promise.resolve(cache)
    }
  }
  const alive: number = Number(config.alive) || 0

  return requestQueue.set(
    KEY,
    AXIOS.request(config)
      .then(
        (res: any): any => {
          shouldCache && dataStore.set(KEY, res, alive) // 设置缓存
          requestQueue.remove(KEY) // 移除请求队列

          return res
        }
      )
      .catch(
        (error: any): any => {
          requestQueue.remove(KEY) // 移除请求队列

          throw error
        }
      )
  )
}
/// http 方法 ///
/** get请求
 * @param {String} url 请求地址
 * @param {Object} params 查询参数
 * @param {Object} config 请求配置
 *
 * @returns {Promise} 响应
 */
function get(
  url: string,
  params?: IObject<any>,
  config?: IObject<any>
): Promise<any> {
  return request(url, 'get', params, null, config)
}
/** put请求
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
  params?: IObject<any>,
  config?: IObject<any>
): Promise<any> {
  return request(url, 'put', params, data, config)
}
/** post请求
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
  params?: IObject<any>,
  config?: IObject<any>
): Promise<any> {
  return request(url, 'post', params, data, config)
}
/** delete请求
 * @param {String} url 请求地址
 * @param {Object} params 查询参数
 * @param {Object} config 请求配置
 *
 * @returns {Promise} 响应
 */
function del(
  url: string,
  params?: IObject<any>,
  config?: IObject<any>
): Promise<any> {
  return request(url, 'delete', params, null, config)
}

export { get, put, post, del }
