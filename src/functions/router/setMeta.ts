import { RouterOptions, RouteConfig } from 'vue-router'

import CONFIG, { SPA } from '@/config'
import getKey from '@/utils/getKey'

function setMeta(route: RouteConfig, parent?: RouteConfig) {
  const meta = route.meta || (route.meta = {})
  /// 鉴权 ///
  // ...

  /// 设置元数据 ///
  if (parent) {
    meta.name || (parent.meta && (meta.name = parent.meta.name))
    meta.parent = parent
  }

  /// 子路由 ///
  const children = route.children
  if (children) {
    const filteredChildren: RouteConfig[] = []
    let child
    for (child of children) {
      setMeta(child, route)
      child.meta.parent && filteredChildren.push(child)
    }
    filteredChildren.length
      ? (route.children = filteredChildren)
      : delete route.children
  }
}

/** 筛选 & 设置路由meta */
export default (config: RouterOptions) => {
  const META = (config as any).meta || ((config as any).meta = {})
  const ALL_ROUTES = config.routes
  const filteredRoutes: RouteConfig[] = []
  function filterRoutes(routes?: RouteConfig[]) {
    if (!routes || !routes.length) {
      return
    }

    let route
    for (route of routes) {
      /// 筛选路由 ///
      // ...

      route.path || (route.path = getKey('/'))
      META.home || (META.home = route.path)
      setMeta(route)
      filteredRoutes.push(route)
    }
  }

  filterRoutes(ALL_ROUTES)
  filteredRoutes.length
    ? (config.routes = filteredRoutes)
    : CONFIG.g(SPA.notFind)
}
