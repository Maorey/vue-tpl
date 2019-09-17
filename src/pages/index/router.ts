/*
 * @Description: 路由管理
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue from 'vue'
import Router from 'vue-router'

import { IObject } from '@/types'
import { getAsync } from '@/utils/highOrder' // 高阶组件工具

import CONFIG from './config/route'

import refreshRoute from '@/utils/refreshRoute'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router) // 全局注册

const ROUTE = CONFIG as IObject

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: `/${ROUTE.home.name}`,
      name: ROUTE.home.name,
      component: getAsync(() =>
        import(/* webpackChunkName: "iHome" */ '@index/views/Home')
      ) as any,
    },
    {
      path: `/${ROUTE.about.name}`,
      name: ROUTE.about.name,
      component: getAsync(() =>
        import(/* webpackChunkName: "iAbout" */ '@index/views/About')
      ) as any,
    },

    // 默认重定向到首页去（加上刷新的重定向会无效）
    // {
    //   path: '*',
    //   redirect: `/${ROUTE.home.name}`,
    // },
  ],
})

/// 导航守卫 ///
let timer = 0
const REG_REDIRECT = /\/r\//i
const PATH_HOME = `/${ROUTE.home.name}`
const forceUpdate = () => refreshRoute(router.currentRoute.matched)
router.beforeEach((to, from, next) => {
  NProgress.start() // 开始进度条
  /// 重定向到并刷新目标路由: this.$router.replace('/r' + this.$route.fullPath) ///
  let toFullPath = to.redirectedFrom || to.fullPath
  if (REG_REDIRECT.test(toFullPath)) {
    toFullPath = toFullPath.replace(REG_REDIRECT, '/')
    toFullPath === from.fullPath ? NProgress.done() : next(toFullPath)
    clearTimeout(timer)
    timer = setTimeout(forceUpdate)
    return
  }
  /// 未知路由重定向到首页 ///
  if (!router.resolve(to).route.matched.length) {
    next(PATH_HOME)
    return
  }

  /// 路由权限处理 ///
  next() // 不调用则不跳转
})
router.afterEach((to, from) => {
  /// 设置页面标题 ///
  const name: string | undefined = to.name
  let key: string
  let tmp: any
  for (key in ROUTE) {
    tmp = ROUTE[key]
    if (tmp && tmp.name === name) {
      document.title = tmp.title
      break
    }
  }

  NProgress.done() // 结束进度条
})
router.onError(() => {
  NProgress.done() // 结束进度条
  /// 跳转到错误页面 ///
  /// 收集错误信息 ///
})

export default router
