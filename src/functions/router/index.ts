/** 路由公共逻辑 */
import Vue from 'vue'
import Router, { Route, RouterOptions, RouteConfig } from 'vue-router'

import authenticate from './authenticate'
import routerGuards from './routerGuards'

export interface RouteMeta {
  /** 唯一标识 */
  id: string
  /** 标题 */
  title: string
  /** 父路由 */
  parent?: IRouteConfig
  /** 路由最大缓存时间 */
  alive?: number
  /** 下次访问路由是否需要重新加载 */
  reload?: boolean
  /** alive setTimeout id */
  t?: number
  /** 嵌套路由自动加key用以标识 */
  k?: number
}

declare global {
  /** 路由对象 */
  interface IRoute extends Route {
    meta: RouteMeta
  }
  interface IRouteConfig extends RouteConfig {
    meta: RouteMeta
  }
}

export default (config: RouterOptions) => {
  authenticate(config)

  const router = new Router(config)
  routerGuards(router)

  Vue.use(Router)
  return router
}
