/** 导航守卫 */
import CONFIG, { SPA } from '@/config'
import { cancel } from '@/utils/ajax'
import getKey from '@/utils/getKey'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Vue from 'vue'
import Router, { Location, Route } from 'vue-router'

export default (router: Router) => {
  ;(router as any).$ = Vue.observable({ e: null }) // hack 路由刷新

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

    // 没实例(已经渲染了, 劫持render也没用) 刷她爸爸/整个网页
    instance ||
      ((temp = (route as any).parent) // eslint-disable-line no-cond-assign
        ? refreshRoute(temp, noTop)
        : noTop || location.reload())
  }

  const REG_REDIRECT = /\/r\//
  const REG_REDIRECT_END = /\/r\/$/
  const REG_REPEAT = /\/{2,}/i
  const META = (router as any).options.meta
  router.beforeEach((to, from, next) => {
    if (REG_REPEAT.test(to.path)) {
      return next({
        path: to.path.replace(REG_REPEAT, '/'),
        query: to.query,
        hash: to.hash,
        replace: true,
      })
    }

    let temp
    if (
      !to.matched.length ||
      REG_REDIRECT_END.test((temp = to.redirectedFrom || to.path))
    ) {
      if (temp || REG_REDIRECT.test((temp = to.redirectedFrom || to.path))) {
        temp = temp.replace(REG_REDIRECT, '/')
        if (temp === (from.redirectedFrom || from.path)) {
          return refreshRoute(from)
        }

        if ((to = router.resolve(temp).route).matched.length) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          to.meta!.reload = 1
          return next(to as Location) // 还是会再进一次beforeEach ┐(: ´ ゞ｀)┌
        }
      }

      if (!from.matched.length) {
        return next(META.home)
      }

      if (to.path === '/') {
        return META.home === from.fullPath
          ? refreshRoute(from)
          : next(META.home)
      }

      return CONFIG.g(SPA.notFind)
    }

    NProgress.start()
    cancel('导航: 取消未完成请求')

    // 缓存控制
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if ((temp = to.meta!).alive <= 0) {
      refreshRoute(to, 1)
    } else {
      temp.reload && refreshRoute(to, 1)
      if (temp.t) {
        clearTimeout(temp.t)
        temp.t = 0
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (!(from.meta!.alive <= 0)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from.meta!.t = setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          from.meta!.reload = 1
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        }, from.meta!.alive || CONFIG.pageAlive)
      }
    }

    // 关闭所有提示
    if ((!temp.reload || (temp.reload = 0)) && from.matched.length) {
      temp = router.app
      try {
        temp.$message.closeAll()
        temp.$notify.closeAll()
        temp.$msgbox.close()
      } catch (error) {}
    }

    // 为每个路由对应的组件添加 props:route (路由配置props只允许对象 不然报错给你看)
    if ((temp = to.matched) && (temp = temp[temp.length - 1])) {
      temp = temp.props as any
      temp = temp.default || (temp.default = {})
      ;(!temp.route || temp.route.fullPath !== to.fullPath) && (temp.route = to)
    }

    next()
  })

  router.afterEach((to: any) => {
    const meta = to.meta
    let temp = META.name || ''
    temp = meta.name ? meta.name + (temp && ' - ' + temp) : temp
    temp && (document.title = temp)

    // 下级页面始终滚动到顶部
    if (!meta.parent) {
      if (document.body.scrollTop) {
        document.body.scrollTop = 0
      } else if (document.documentElement.scrollTop) {
        document.documentElement.scrollTop = 0
      }
    }

    NProgress.done()
  })
}
