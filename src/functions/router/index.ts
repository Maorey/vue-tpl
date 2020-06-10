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
function mergePath(path: string, relativePath: string, isAppend?: boolean) {
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

export default (config: RouterOptions, authority?: boolean) => {
  authority && authenticate(config)

  const router = new Router(config)

  // 相对路径支持 '' './' '../'
  const REG_QUERY = /[?#].*$/
  function resolveRelativePath(location: RawLocation) {
    const isStr = isString(location)
    let relativePath = isStr
      ? (location as string).replace(REG_QUERY, '')
      : (location as Location).path

    if (!relativePath || relativePath[0] === '/') {
      return location
    }

    relativePath = mergePath(
      router.currentRoute.path,
      relativePath,
      (location as Location).append
    )
    if (isStr) {
      return relativePath
    }

    ;(location as Location).append = false
    ;(location as Location).path = relativePath
    return location
  }

  const originPush = router.push
  router.push = (function(this: any, location: RawLocation) {
    arguments[0] = resolveRelativePath(location)
    return originPush.apply(this, arguments as any)
  } as any) as typeof originPush

  const originReplace = router.replace
  router.replace = (function(this: any, location: RawLocation) {
    arguments[0] = resolveRelativePath(location)
    return originReplace.apply(this, arguments as any)
  } as any) as typeof originReplace

  const originResolve = router.resolve
  router.resolve = (function(this: any, location: RawLocation) {
    arguments[0] = resolveRelativePath(location)
    return originResolve.apply(this, arguments as any)
  } as any) as typeof originResolve

  routerGuards(router)
  Vue.use(Router)

  return router
}
