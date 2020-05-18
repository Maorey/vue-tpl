import { RouterOptions, RouteConfig } from 'vue-router'

import getKey from '@/utils/getKey'

/** 筛选 & 设置路由meta */
export default function setMeta(config: RouterOptions, routes?: RouteConfig[]) {
  const META = (config as any).meta || ((config as any).meta = {})
  arguments.length > 1 || (routes = config.routes)
  if (!routes || !routes.length) {
    return
  }

  let route
  let meta
  for (route of routes) {
    route.path || (route.path = getKey('/')) // 默认路径
    META.home || (META.home = route.path) // 首页默认第一个路由
    meta = route.meta || (route.meta = {})
    meta._ = true // 有权访问 或者移除无权的
    setMeta(META, route.children)
  }
}
