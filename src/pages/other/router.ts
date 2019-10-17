/*
 * @Description: 路由管理
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue from 'vue'
import Router, { RouterOptions } from 'vue-router'

import configRoute from './config/route'
import refreshRoute from '@/utils/refreshRoute'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router) // 全局注册

const router = new Router(configRoute as RouterOptions)

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
        refreshRoute(fromMatched)
      } else {
        to = router.resolve(toPath).route
        toMatched = to.matched
        if (toMatched.length) {
          refreshRoute(toMatched)
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

  next()
})
const TITLE_APP = configRoute.meta.name // 标题
router.afterEach(to => {
  /// 设置页面标题 ///
  document.title = to.meta.name ? `${to.meta.name} - ${TITLE_APP}` : TITLE_APP

  NProgress.done() // 结束进度条
})

export default router
