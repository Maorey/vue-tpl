/*
 * @Description: 项目全局配置
 * @Author: 毛瑞
 * @Date: 2019-06-19 12:52:09
 */
export default {
  /*! 【全局配置(时间单位ms)】 */

  /*! 【↓ SPA配置 ↓】history路由必须绝对路径 */
  /*! 首页 */
  /** 首页 */
  index: './',

  /*! 登录页 */
  /** 登录页 */
  login: 'login',

  /*! 其他页 */
  /** 其他页 */
  other: 'other',

  /*! 未知页 */
  /** 未知页 */
  notFind: '404',

  /*! 错误页 */
  /** 错误页 */
  error: '50x',
  /*! 【↑ SPA配置 ↑】 */

  /** 去指定SPA
   * @param id SPA ID, 见this键值
   *
   *  falsy: 去登录页
   *
   *  string: 去指定页
   *
   *  不存在的id: 未知页
   * @param query 查询参数 自己拼 ?foo=0&bar=1#hash...
   */
  g(id?: string, search?: string) {
    try {
      window.stop() // 停止加载资源
    } catch (error) {}
    location.href =
      (id ? (this as any)[id] || this.notFind : this.login) + (search || '')
    throw 0 // eslint-disable-line no-throw-literal
  },

  /*! 接口请求超时 0表示不限制 */
  /** 接口请求超时 0表示不限制 */
  timeout: 30 * 1000,

  /*! 全局接口响应缓存最大数量 */
  /** 全局接口响应缓存最大数量 */
  apiMaxCache: 66,

  /*! 全局接口响应缓存最大存活时间 */
  /** 全局接口响应缓存最大存活时间 */
  apiCacheAlive: 3 * 1000,

  /*! 身份有效期(取与服务端有效期的最小值) */
  /** 身份有效期(取与服务端有效期的最小值) */
  tokenAlive: 2 * 60 * 60 * 1000,

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
