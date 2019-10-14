/*
 * @Description: 路由管理
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import configRoute from './config/route'
import refreshRoute from '@/utils/refreshRoute'

import Vue from 'vue'
import Router, { RouterOptions } from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router) // 全局注册

const router = new Router(configRoute as RouterOptions)

/// 导航守卫 ///
let timer = 0
const REG_REDIRECT = /\/r\//i
const PATH_HOME = configRoute.meta.home // 首页
const forceUpdate = () => {
  refreshRoute(router.currentRoute.matched)
  NProgress.done()
}
router.beforeEach((to, from, next) => {
  NProgress.start() // 开始进度条

  /// 重定向到并刷新目标路由: this.$router.replace('/r' + this.$route.fullPath) ///
  let toFullPath = to.redirectedFrom || to.fullPath
  if (REG_REDIRECT.test(toFullPath)) {
    toFullPath = toFullPath.replace(REG_REDIRECT, '/')
    toFullPath === from.fullPath || next(toFullPath)
    clearTimeout(timer)
    timer = setTimeout(forceUpdate)
    return
  }
  /// 未知路由重定向到首页 ///
  if (!router.resolve(to).route.matched.length) {
    PATH_HOME === from.fullPath ? NProgress.done() : next(PATH_HOME)
    return
  }

  /// 路由权限处理 ///
  next() // 不调用则不跳转
})
const TITLE_APP = configRoute.meta.name // 标题
router.afterEach((to, from) => {
  /// 设置页面标题 ///
  document.title = to.meta.name ? `${to.meta.name} - ${TITLE_APP}` : TITLE_APP

  NProgress.done() // 结束进度条
})
router.onError(() => {
  NProgress.done() // 结束进度条
  /// 跳转到错误页面 ///
  /// 收集错误信息 ///
})

export default router
