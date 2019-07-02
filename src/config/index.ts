/*
 * @Description: 项目全局配置
 * @Author: 毛瑞
 * @Date: 2019-06-19 12:52:09
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-02 15:05:05
 */

/*! 【全局配置 开始】 */
export default {
  /*! 请求接口基础路径 */ baseUrl: process.env.BASE_URL,
  /*! 接口请求超时 */ timeout: process.env.REQUEST_TIMEOUT,
  /*! 全局接口响应缓存最大数量 */ apiMaxCache: process.env.REQUEST_MAX_CACHE,
  /*! 全局接口响应缓存最大存活时间 */ apiCacheAlive: process.env.REQUEST_CACHE_ALIVE,
}
/*! 【全局配置 结束】 */
