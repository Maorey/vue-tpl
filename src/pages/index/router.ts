/*
 * @Description: 路由管理
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue from 'vue'
import Router, { RouterOptions, RouteConfig, RouteRecord } from 'vue-router'

import configRoute from './config/route'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const META = configRoute.meta
let PAGE_HOME: string | undefined
META.home && (PAGE_HOME = META.home)
/// 路由元数据 ///
;(function hack(list?: RouteConfig[]) {
  if (!list || !list.length) {
    return
  }
  let route
  let meta
  for (route of list) {
    PAGE_HOME || (PAGE_HOME = route.path) // 首页默认第一个路由
    meta = route.meta || (route.meta = {})
    meta._ = true // 有权访问
    meta.$ = Vue.observable({ e: null }) // hack 刷新路由
    hack(route.children)
  }
})(configRoute.routes as RouteConfig[])

const router = new Router(configRoute as RouterOptions)

/// 路由局部刷新 ///
/**
<KeepAlive
  :max="9"
  :exclude="$route.meta.$.e"
>
  <RouterView />
</KeepAlive>
keep-alive 缓存处理，这很hacky, 俺know
也可以通过切换key绑定实现(如下)，但是:
1. 没有max可能内存溢出
2. 有max，刷新后其他已缓存组件会被逐渐挤出缓存
<KeepAlive :max="9">
  <RouterView :key="$route.meta.$.k" />
</KeepAlive>
*/
let counter = 0
function refreshRoute(matched: RouteRecord[], meta: { e: any }) {
  let temp: any = matched.length
  let instances
  while (temp--) {
    if ((instances = matched[temp]).instances) {
      matched = instances as any
      instances = instances.instances

      temp = null
      for (temp in instances) {
        ;(temp = instances[temp]) && // 可能是 undefined...
          (temp = temp.$vnode.componentOptions) &&
          (temp = temp.Ctor.options) &&
          (meta.e = temp.name = 'r' + counter++)
      }

      if (temp === null && (matched as any).parent) {
        // 没实例 - 刷她爸爸
        refreshRoute([(matched as any).parent], meta)
      }
      return
    }
  }
}

/// 导航守卫 ///
const REG_REDIRECT = /\/r\//
router.beforeEach((to, from, next) => {
  NProgress.start() // 开始进度条

  const fromPath = from.redirectedFrom || from.fullPath
  const fromMatched = from.matched
  let toPath = to.redirectedFrom || to.fullPath
  let toMatched = to.matched
  if (!toMatched.length) {
    if (fromMatched.length && REG_REDIRECT.test(toPath)) {
      /// 重定向并刷新目标路由 ///
      toPath = toPath.replace(REG_REDIRECT, '/')
      if (fromPath === toPath) {
        // 当前
        refreshRoute(fromMatched, from.meta.$)
      } else {
        to = router.resolve(toPath).route
        toMatched = to.matched
        if (toMatched.length) {
          refreshRoute(toMatched, to.meta.$)
          next(to) // 还是要再进一次beforeEach, 虽然都给解析出来了┐(: ´ ゞ｀)┌
          return
        }
      }
    } else if (fromPath !== PAGE_HOME) {
      next(PAGE_HOME)
    }
    NProgress.done()
    return
  }

  /// 跳转 ///
  to.meta._ ? next() : fromMatched.length ? NProgress.done() : next(PAGE_HOME)
})
router.afterEach(to => {
  /// 设置页面标题 ///
  let title = META.name || ''
  title = to.meta.name ? to.meta.name + (title && ' - ' + title) : title
  title && (document.title = title)

  NProgress.done() // 结束进度条
})

Vue.use(Router) // 全局注册

export default router
