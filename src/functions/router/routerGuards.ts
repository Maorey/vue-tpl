/** 导航守卫 */
import Vue from 'vue'
import Router, { Route, Location } from 'vue-router'

import CONFIG from '@/config'
import getKey from '@/utils/getKey'
import { cancel } from '@/utils/ajax'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default (router: Router) => {
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
  function refreshRoute(route: Route, noTop?: 1) {
    if (route.matched) {
      route = route.matched as any // 最后一个match一定是当前路由
      route = (route as any)[(route as any).length - 1]
    }

    let temp: any
    let instance: any
    const instances = (route as any).instances
    const HOOK = 'hook:beforeDestroy'
    for (temp in instances) {
      if (
        (instance = instances[temp]) &&
        (temp = (temp = instance.$vnode.componentOptions) && temp.Ctor.options)
      ) {
        if (!instance._$a) {
          instance._$a = temp.name
          instance.$once(HOOK, restoreName)
        }
        ;(router as any).$.e = temp.name = getKey('r')
      }
    }

    // 没实例(已经渲染了,劫持render也没用) 刷她爸爸/整个网页
    instance ||
      ((temp = (route as any).parent) // eslint-disable-line no-cond-assign
        ? refreshRoute(temp, noTop)
        : noTop || location.reload())
  }

  const REG_REDIRECT = /\/r\//
  const META = (router as any).options.meta
  router.beforeEach((to, from, next) => {
    let temp
    if (!to.matched.length) {
      if (!from.matched.length) {
        return next(META.home)
      }
      if (REG_REDIRECT.test((temp = to.redirectedFrom || to.fullPath))) {
        temp = temp.replace(REG_REDIRECT, '/')
        if (temp === (from.redirectedFrom || from.fullPath)) {
          return refreshRoute(from)
        }
        // 重定向并刷新
        if ((to = router.resolve(temp).route).matched.length) {
          refreshRoute(to, 1)
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
    // 缓存控制
    if ((temp = to.meta).alive <= 0) {
      refreshRoute(to, 1)
    } else {
      if (temp.reload) {
        refreshRoute(to, 1)
        temp.reload = 0
      }
      if (temp.t) {
        clearTimeout(temp.t)
        temp.t = 0
      }
      if (!((temp = from.meta.alive) <= 0)) {
        from.meta.t = setTimeout(() => {
          from.meta.reload = 1
        }, temp || CONFIG.pageAlive)
      }
    }
    // 关闭所有提示
    temp = router.app
    try {
      temp.$message.closeAll()
      temp.$notify.closeAll()
      temp.$msgbox.close()
    } catch (error) {}
    // 记录离开前的滚动位置
    // if ((temp = temp.$el) && (temp = temp.querySelector('.el-main'))) {
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
  //     const meta = ((this as any).route || this.$route).meta
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
}
