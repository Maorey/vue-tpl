/*
 * @Description: 项目全局配置
 * @Author: 毛瑞
 * @Date: 2019-06-19 12:52:09
 */
export default {
  /*! 【全局配置】 */

  /*! 请求接口基础路径(hash路由建议相对路径, 比如'api') */
  /** 请求接口基础路径(hash路由建议相对路径, 比如'api') */
  baseUrl: process.env.BASE_PATH,

  /*! 接口请求超时 0表示不限制 */
  /** 接口请求超时 0表示不限制 */
  timeout: 30 * 1000,

  /*! 全局接口响应缓存最大数量 */
  /** 全局接口响应缓存最大数量 */
  apiMaxCache: 66,

  /*! 全局接口响应缓存最大存活时间 */
  /** 全局接口响应缓存最大存活时间 */
  apiCacheAlive: 30 * 1000,

  /*! token header 字段 */
  /** token header 字段 */
  token: 'token',

  /*! token 有效期(小时 服务端响应？) */
  /** token 有效期(小时 服务端响应？) */
  tokenAlive: 24 * 7,

  /*! 本地偏好存储键 */
  /** 本地偏好存储键 */
  prefer: 'prefer',

  /*! 最大页面缓存数 */
  /** 最大页面缓存数 */
  page: 9,

  /*! 最大子页面缓存数 */
  /** 最大子页面缓存数 */
  subPage: 5,

  /*! 最大页面缓存时间 */
  /** 最大页面缓存时间 */
  pageAlive: 30 * 1000,
}
