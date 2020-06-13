/** 路由公共逻辑 */
import Vue from 'vue'
import Router, {
  Route,
  RouterOptions,
  RouteConfig,
  RawLocation,
  Location,
} from 'vue-router'

import { isString } from '@/utils'
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

function upper(path: string) {
  return path && path.substring(0, path.lastIndexOf('/'))
}
// const REG_REPEAT = /(^|\/)\.{3,}\//i
function resolveRelativePath(
  path: string,
  relativePath: string,
  isAppend?: boolean
) {
  // relativePath.replace(REG_REPEAT, '$1../')
  path[path.length - 1] === '/' && (path = path.substring(0, path.length - 1))
  let index = 0
  let shouldBreak // 代替 label outer: while () { ...
  while (relativePath[index] === '.') {
    switch (relativePath[index + 1]) {
      case '.':
        index++
        while (relativePath[++index] === '.') {}
        if (relativePath[index++] === '/') {
          path = upper(path)
        } else {
          shouldBreak = 1
        }
        break
      case '/':
        index += 2
        break
      default:
        shouldBreak = 1
    }
    if (shouldBreak) {
      break
    }
  }

  return (
    (isAppend ? path : upper(path)) +
    '/' +
    (index ? relativePath.substring(index) : relativePath)
  )
}

const REG_URL = /^([^?#]+)([?#].*)?$/
export function resolveUrl<T = RawLocation>(
  path: string,
  location: T,
  refresh?: boolean
) {
  const isStr = isString(location)
  let relativePath: string | RegExpExecArray = (isStr
    ? location
    : (location as Location).path) as string

  if (!relativePath || relativePath[0] === '/') {
    if (refresh) {
      relativePath = '/r/' + (relativePath || path)
      if (isStr) {
        location = (relativePath as any) as T
      } else {
        ;(location as Location).path = relativePath
      }
    }
    return location
  }

  relativePath = REG_URL.exec(relativePath) as RegExpExecArray
  relativePath =
    resolveRelativePath(path, relativePath[1], (location as Location).append) +
    (refresh ? '/r/' : '') +
    (relativePath[2] || '')

  if (isStr) {
    return (relativePath as any) as T
  }

  ;(location as Location).append = false
  ;(location as Location).path = relativePath
  return location
}

export default (config: RouterOptions, authority?: boolean) => {
  authority && authenticate(config)

  const router = new Router(config)

  // 相对路径支持 '' './' '../'
  const originPush = router.push
  router.push = (function(this: any, location: RawLocation) {
    arguments[0] = resolveUrl(router.currentRoute.path, location)
    return originPush.apply(this, arguments as any)
  } as any) as typeof originPush

  const originReplace = router.replace
  router.replace = (function(this: any, location: RawLocation) {
    arguments[0] = resolveUrl(router.currentRoute.path, location)
    return originReplace.apply(this, arguments as any)
  } as any) as typeof originReplace

  const originResolve = router.resolve
  router.resolve = (function(this: any, location: RawLocation) {
    arguments[0] = resolveUrl(
      router.currentRoute.path,
      arguments[2]
        ? isString(location)
          ? { path: location, append: true }
          : ((location.append = true), location)
        : location
    )
    return originResolve.apply(this, arguments as any)
  } as any) as typeof originResolve

  routerGuards(router)
  Vue.use(Router)

  return router
}
