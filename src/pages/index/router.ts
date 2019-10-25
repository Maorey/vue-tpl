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

// hack 刷新路由(/权限控制)
;(function hack(list?: RouteConfig[]) {
  if (!list || !list.length) {
    return
  }
  for (let config of list) {
    config.meta || (config.meta = {})
    config.meta.$ = Vue.observable({ e: null }) // hack 刷新路由
    hack(config.children)
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
  let record
  let temp
  for (record of matched) {
    for (temp in record.instances) {
      ;(temp = record.instances[temp].$vnode.componentOptions) &&
        (temp = (temp.Ctor as any).options) &&
        (meta.e = temp.name = '' + counter++)
    }
  }
}

/// 导航守卫 ///
const REG_REDIRECT = /\/r\//
const PATH_HOME = configRoute.meta.home
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
    } else if (PATH_HOME !== fromPath) {
      next(PATH_HOME)
    }
    NProgress.done()
    return
  }

  /// 路由权限处理 ///
  next()
})
const TITLE_APP = configRoute.meta.name // 标题
router.afterEach(to => {
  /// 设置页面标题 ///
  document.title = to.meta.name ? `${to.meta.name} - ${TITLE_APP}` : TITLE_APP

  NProgress.done() // 结束进度条
})

Vue.use(Router) // 全局注册

export default router
