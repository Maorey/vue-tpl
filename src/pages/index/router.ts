/*
 * @Description: 路由管理
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue from 'vue'
import Router, { RouterOptions, RouteConfig, Route, Location } from 'vue-router'

import configRoute from '@iRoute' // 使用别名
import getKey from '@/utils/getKey'
import { cancel } from '@/utils/ajax'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const META = configRoute.meta
/// 路由元数据 ///
;(function hack(list?: RouteConfig[]) {
  if (!list || !list.length) {
    return
  }
  let route
  let meta
  for (route of list) {
    route.path || (route.path = getKey('/')) // 默认路径
    META.home || (META.home = route.path) // 首页默认第一个路由
    meta = route.meta || (route.meta = {})
    meta._ = true // 有权访问 或者移除无权的
    hack(route.children)
  }
})(configRoute.routes as RouteConfig[])

// scrollBehavior 不能处理指定元素的滚动
const router = new Router(configRoute as RouterOptions)
;(router as any).$ = Vue.observable({ e: null }) // hack 刷新路由

/// 路由刷新 ///
/**
<KeepAlive
  :max="9"
  :exclude="$router.$.e"
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
function restoreName(this: any) {
  let temp
  this._$a &&
    (temp = this.$vnode.componentOptions) &&
    (temp = temp.Ctor.options) &&
    (temp.name = this._$a)
}
function refreshRoute(route: Route) {
  if (route.matched) {
    route = route.matched as any // 最后一个match一定是当前路由
    route = (route as any)[(route as any).length - 1]
  }

  let temp: any
  let instance: any
  const HOOK = 'hook:beforeDestroy'
  for (temp in (route as any).instances) {
    if (
      (instance = (route as any).instances[temp]) &&
      (temp = (temp = instance.$vnode.componentOptions) && temp.Ctor.options)
    ) {
      if (!instance._$a) {
        instance._$a = temp.name
        instance.$on(HOOK, restoreName)
      }
      ;(router as any).$.e = temp.name = getKey('r')
    }
  }

  // 没实例 刷她爸爸/整个网页
  instance ||
    ((route as any).parent
      ? refreshRoute((route as any).parent)
      : location.reload())
}

/// 导航守卫 ///
const REG_REDIRECT = /\/r\//
router.beforeEach((to, from, next) => {
  let temp
  if (!to.matched.length) {
    // 没有匹配的路由
    if (!from.matched.length) {
      next(META.home)
      return
    }
    if (REG_REDIRECT.test((temp = to.redirectedFrom || to.fullPath))) {
      temp = temp.replace(REG_REDIRECT, '/')
      if (temp === (from.redirectedFrom || from.fullPath)) {
        refreshRoute(from)
        return
      }
      // 重定向并刷新
      if ((to = router.resolve(temp).route).matched.length) {
        refreshRoute(to)
        next(to as Location) // 还是要再进一次beforeEach, 虽然都给解析出来了┐(: ´ ゞ｀)┌
      }
    }
    return
  }
  if (!to.meta._) {
    // 没访问权限
    from.matched.length || next(META.home)
    return
  }
  NProgress.start() // 开始进度条
  cancel('导航: 取消未完成请求')
  // 关闭所有提示
  temp = router.app
  temp.$message.closeAll()
  temp.$notify.closeAll()
  try {
    temp.$msgbox.close()
  } catch (error) {}
  // if ((temp = temp.$el) && (temp = temp.querySelector('.el-main'))) {
  //   // 记录离开前的滚动位置
  //   from.meta.x = temp.scrollLeft
  //   from.meta.y = temp.scrollTop
  // }
  // 为每个路由对应的组件添加 props:route (路由配置props只允许对象 不然报错给你看)
  if ((temp = to.matched) && (temp = temp[temp.length - 1])) {
    temp = temp.props as any
    temp = temp.default || (temp.default = {})
    ;(!temp.route || temp.route.fullPath !== to.fullPath) && (temp.route = to)
  }

  next()
})

// function restoreScrollPosition(this: Vue) {
//   const container = this.$root.$el.querySelector('.el-main')
//   if (container) {
//     const meta = this.$route.meta
//     container.scrollLeft = meta.x
//     container.scrollTop = meta.y
//   }
// }
router.afterEach((to: any) => {
  // 设置页面标题
  const meta = to.meta
  let temp: any = META.name || ''
  temp = meta.name ? meta.name + (temp && ' - ' + temp) : temp
  temp && (document.title = temp)
  // 还原滚动位置
  // if ((meta = to.matched)) {
  //   const HOOK = 'hook:activated'
  //   for (temp of meta) {
  //     if ((temp = temp.instances)) {
  //       for (to in temp) {
  //         if ((to = temp[to]) && !to._$b) {
  //           to._$b = restoreScrollPosition
  //           to.$on(HOOK, to._$b)
  //         }
  //       }
  //     }
  //   }
  // }

  NProgress.done() // 结束进度条
})

Vue.use(Router) // 全局注册

export default router
