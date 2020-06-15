import { RouterOptions, RouteConfig } from 'vue-router'

import CONFIG, { SPA } from '@/config'
import getKey from '@/utils/getKey'
import { AUTH, authFit, authHas, Menu, ChildInfo } from '../auth'

function isAuthorized(id: string, meta: any) {
  if (meta.fit) {
    return authFit(id, Array.isArray(meta.fit) ? meta.fit : [meta.fit])
  }
  if (meta.has) {
    return authHas(id, Array.isArray(meta.has) ? meta.has : [meta.has])
  }
  return true
}

function filterChildren(route: RouteConfig, childInfo?: ChildInfo[]) {
  const children = route.children
  let len = children && children.length
  if (!len) {
    return
  }

  const metaRoute = route.meta
  const filteredChildren: RouteConfig[] = []
  let info: ChildInfo
  let child: RouteConfig
  let metaChild
  let cLen = childInfo && childInfo.length
  while (len--) {
    child = (children as any)[len]
    metaChild = child.meta || (child.meta = {})
    info = (cLen && (childInfo as ChildInfo[])[--cLen]) as ChildInfo
    if (isAuthorized(metaRoute.id, metaChild)) {
      metaChild.id = metaRoute.id
      child.path && (metaChild.parent = route)
      metaChild.title = info ? info.title || '' : metaRoute.title
      metaChild.alive >= 0 ||
        (metaRoute.alive >= 0 && (metaChild.alive = metaRoute.alive))

      filterChildren(child, info && info.child)
      filteredChildren.unshift(child)
    }
  }
  filteredChildren.length
    ? (route.children = filteredChildren)
    : delete route.children
}

/** 筛选 & 设置路由meta */
export default (config: RouterOptions) => {
  const ROUTES = AUTH.children
  const ALL_ROUTES = config.routes as RouteConfig[]
  if (!ROUTES || !ROUTES.length || !ALL_ROUTES || !ALL_ROUTES.length) {
    return CONFIG.g(SPA.notFind)
  }

  const META = (config as any).meta || ((config as any).meta = {})
  const filteredRoutes: RouteConfig[] = []
  function filterRoutes(authes?: Menu[]) {
    if (!authes || !authes.length) {
      return
    }

    let auth
    let id
    let route
    let meta
    for (auth of authes) {
      id = auth.id
      auth.icon || (auth.icon = META.icon)

      for (route of ALL_ROUTES) {
        meta = route.meta || (route.meta = {})
        if (id === meta.id) {
          auth.path = route.path = auth.path || route.path || getKey('/')
          meta.title = auth.title
          auth.path === '/'
            ? (META.home = '/')
            : META.home || (META.home = auth.path)

          filterChildren(route, auth.child)
          filteredRoutes.push(route)
          break
        }
      }

      filterRoutes(auth.children)
    }
  }

  filterRoutes(ROUTES)
  filteredRoutes.length
    ? (config.routes = filteredRoutes)
    : CONFIG.g(SPA.notFind)
}
