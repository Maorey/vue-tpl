import { isString, isBool, isNull } from '@/utils'

/** SPA字典 */
export const enum SPA {
  /** 首页 */
  index = 'index',
  /** 登录页 */
  login = 'login',
  /** 其他页 */
  other = 'other',
  /** 未知页 */
  notFind = 'notFind',
  /** 错误页 */
  error = 'error',
}

interface Jump {
  (id?: SPA, params?: string, open?: boolean | null): never
}
interface Jump {
  (id?: SPA, open?: boolean | null, params?: string): never
}

/** 全局配置 */
export default {
  /*! 【全局配置(时间单位ms)】 */

  /*! 【↓ SPA配置 ↓】history路由必须绝对路径 */
  /*! 首页 */
  /** 首页 */
  [SPA.index]: './',

  /*! 登录页 */
  /** 登录页 */
  [SPA.login]: 'login',

  /*! 其他页 */
  /** 其他页 */
  [SPA.other]: 'other',

  /*! 未知页 */
  /** 未知页 */
  [SPA.notFind]: '404',

  /*! 错误页 */
  /** 错误页 */
  [SPA.error]: '50x',
  /*! 【↑ SPA配置 ↑】 */

  /*! 路由模式 */
  /* 路由模式 */
  mode: 'hash',

  /** 去指定SPA
   * @param id SPA ID, 见this键值
   *
   *  falsy: 去登录页
   *
   *  string: 去指定页
   *
   *  不存在的id: 未知页
   * @param params url参数 自己拼 ?foo=0&bar=1#hash...
   * @param open 是否新窗口打开(为null时返回url不跳转)
   */
  g: function(
    this: any,
    id?: any,
    params?: string | boolean,
    open?: boolean | null | string
  ) {
    try {
      window.stop() // 停止加载资源
    } catch (error) {}
    let url
    if (isBool(params) || isNull(params) || isString(open)) {
      url = params
      params = open as string
      open = url
    }

    url =
      (id ? this[id] || this.notFind : this.login) +
      (params
        ? this.mode === 'hash' && (id = (params as string)[0]) !== '#'
          ? id === '/'
            ? '#' + params
            : '#/' + params
          : params
        : '')

    if (isNull(open)) {
      return url
    }

    open ? window.open(url) : (location.href = url)
    throw 0 // eslint-disable-line no-throw-literal
  } as Jump,

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

  /*! 通用筛选表单标签宽度 */
  /** 通用筛选表单标签宽度 */
  labelWidth: '125px',

  /*! 通用输入框字数限制 */
  /** 通用输入框字数限制 */
  maxLength: 60,
}
