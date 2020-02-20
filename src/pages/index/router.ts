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

// scrollBehavior 不能处理指定元素的滚动
const router = new Router(configRoute as RouterOptions)

/// 路由局部刷新 ///
/**
<KeepAlive
  :max="9"
  :exclude="$route.meta.$.e"
>
  <RouterView :key="$route.meta.$.k" />
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
  const HOOK = 'hook:beforeDestroy'
  let temp: any = matched.length
  let instances
  while (temp--) {
    if ((instances = matched[temp]).instances) {
      matched = instances as any
      instances = instances.instances

      temp = 0
      for (temp in instances) {
        // 可能是 undefined...
        if ((temp = instances[temp])) {
          if (temp._$a) {
            temp = (temp = temp.$vnode.componentOptions) && temp.Ctor.options
          } else {
            temp.$on(HOOK, function(this: any) {
              this._$a &&
                (temp = this.$vnode.componentOptions) &&
                (temp = temp.Ctor.options) &&
                (temp.name = this._$a)
            })
            temp._$a =
              (temp = temp.$vnode.componentOptions) &&
              (temp = temp.Ctor.options) &&
              temp.name
          }
          temp && (meta.e = temp.name = 'r' + counter++)
        }
      }

      // 没实例 - 刷她爸爸
      !temp &&
        (matched as any).parent &&
        refreshRoute([(matched as any).parent], meta)
      return
    }
  }
}

/// 导航守卫 ///
const REG_REDIRECT = /\/r\//
router.beforeEach((to, from, next) => {
  NProgress.start() // 开始进度条
  // let app: Vue | Element | null = router.app
  // if ((app = app.$el?.querySelector('.el-main'))) {
  //   // 记录离开前的滚动位置
  //   from.meta.x = app.scrollLeft
  //   from.meta.y = app.scrollTop
  // }

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
// const restoreScrollPosition = function(this: Vue) {
//   const container = this.$root.$el.querySelector('.el-main')
//   if (container) {
//     const meta = this.$route.meta
//     container.scrollLeft = meta.x
//     container.scrollTop = meta.y
//   }
// }
router.afterEach(to => {
  const meta = to.meta
  /// 设置页面标题 ///
  let title = META.name || ''
  title = meta.name ? meta.name + (title && ' - ' + title) : title
  title && (document.title = title)
  // 还原滚动位置
  // if ((meta = to.matched)) {
  //   for (title of meta) {
  //     if ((title = title.instances)) {
  //       for (to in title) {
  //         if ((to = title[to]) && !to._$b) {
  //           to._$b = restoreScrollPosition
  //           to.$on('hook:activated', to._$b)
  //         }
  //       }
  //     }
  //   }
  // }

  NProgress.done() // 结束进度条
})

Vue.use(Router) // 全局注册

export default router
