/*
 * @Description: 项目全局配置
 * @Author: 毛瑞
 * @Date: 2019-06-19 12:52:09
 */
export default {
  /*! 【全局配置↓】 */

  /*! 请求接口基础路径 */
  /** 请求接口基础路径
   */
  baseUrl: '/api',

  /*! 接口请求超时 */
  /** 接口请求超时
   */
  timeout: 30 * 1000,

  /*! 全局接口响应缓存最大数量 */
  /** 全局接口响应缓存最大数量
   */
  apiMaxCache: 66,

  /*! 全局接口响应缓存最大存活时间 */
  /** 全局接口响应缓存最大存活时间
   */
  apiCacheAlive: 30 * 1000,

  /*! token header 字段 */
  /** token header 字段
   */
  token: 'token',

  /*! token 有效期(小时 服务端响应？) */
  /** token 有效期(小时 服务端响应？)
   */
  tokenAlive: 24 * 7,

  /*! 本地偏好存储键 */
  /** 本地偏好存储键
   */
  prefer: 'prefer',

  /*! 【全局配置↑】 */
}
