/** 路由公共逻辑 */
import Vue from 'vue'
import Router, { Route, RouterOptions, RouteConfig } from 'vue-router'

import setMeta from './setMeta'
import routerGuards from './routerGuards'

export interface RouteMeta {
  /** 标题 */
  name: string
  /** 父路由 */
  parent?: RouteConfig
  /** 缩略图 */
  thumb: string
  /** 路由最大缓存时间 */
  alive?: number
  /** 下次访问路由是否需要重新加载 */
  reload?: boolean
  /** alive setTimeout id */
  t?: number
  /** 嵌套路由自动加key用以标识 */
  k?: number
  /** 滚动位置 */
  // x?: number
  // y?: number
}

declare global {
  /** 路由对象 */
  interface IRoute extends Route {
    meta: RouteMeta
  }
}

export default (config: RouterOptions) => {
  setMeta(config)

  const router = new Router(config)
  routerGuards(router)

  Vue.use(Router)
  return router
}
