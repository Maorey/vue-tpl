/** 入口挂载公共逻辑, 手工控制入口大小 */
import Vue from 'vue'
import { Store } from 'vuex'
import Router, { RouteRecord } from 'vue-router'

import { isString } from '@/utils'
import { on, off, once, emit } from '@/utils/eventBus'
import { fit, has } from '@/functions/auth'
import { GLOBAL } from '@/enums/events'
// import { throttle } from '@/utils/performance'
import { dev } from '@/libs/vue'

import '@/libs/components/junior'
import '@/libs/components/senior'

/// 全局样式(使用全局皮肤 src/skin) ///
import 'element-ui/lib/theme-chalk/base.css' // element-ui字体+过渡动画
import '@/scss/base.scss?skin=' // 基础样式
import '@/libs/components/junior.scss'
import '@/libs/components/senior.scss'

/** 埋点(日志采集) */
// function collection() {
//   if (process.env.NODE_ENV === 'production') {
//     Vue.config.errorHandler = function(err, vm, info) {
//       // 采集并上传错误日志
//     }
//     const data: IObject[] = []
//     window.addEventListener(
//       'mousemove',
//       throttle((e: MouseEvent) => {
//         // 页面地址&鼠标位置 可用于统计(比如热力图)用户关注的页面及功能
//         data.push({ url: location.href, x: e.pageX, y: e.pageY })
//       }, 3000)
//     )
//     window.addEventListener('beforeunload', () => {
//       submit(data) // 上传数据
//     })
//   }
// }

function emitErrorhandler(this: Vue, err: Error, event: string) {
  this.$emit('hook:errorCaptured', err, this, 'emit:' + event)
}

export default <T>(App: any, router?: Router, store?: Store<T>) => {
  const proto = Vue.prototype
  /// 注入 ///
  /// 消息总线  ///
  proto.on = on
  proto.off = off
  proto.once = once
  proto.emit = function() {
    const args = arguments as any
    if (isString(args[0])) {
      args[0] = [args[0], emitErrorhandler]
    } else {
      args[0].push(emitErrorhandler)
    }
    emit.apply(this, args)
  }
  if (router) {
    /// 鉴权(指令就没必要了) ///
    proto.authFit = fit
    proto.authHas = has
    /// 路由环境 ///
    proto.getPathById = (id: string) => {
      let route
      for (route of (router as any).options.routes) {
        if (id === route.meta.id) {
          return route.path as string
        }
      }
      return ''
    }
    proto.reloadRouteById = (id: string) => {
      let route
      for (route of (router as any).options.routes) {
        if (id === route.meta.id) {
          return (route.meta.reload = true)
        }
      }
    }
    /// 全局事件 ///
    on(GLOBAL.refresh, () => {
      router.replace('/r' + router.currentRoute.fullPath)
    })
    on(GLOBAL.return, (refresh?: boolean) => {
      let parent: RouteRecord | RouteRecord[] = router.currentRoute.matched
      if ((parent = parent[parent.length - 2])) {
        // TODO: 复杂路由 比如: /foo/:bar/:id
        router.replace((refresh ? '/r' : '') + parent.path)
      }
    })
    on(GLOBAL.jump, (id: string, path?: string) => {
      router.push(proto.getPathById(id) + (path || ''))
    })
  }
  // 全局点击事件
  window.addEventListener('click', e => {
    emit(GLOBAL.click, e)
  })

  // collection()
  dev(Vue)

  // 防阻塞页面（defer的脚本已缓存时不会非阻塞执行bug:chromium#717979）
  // [消息总线]直接复用根实例 (vue之外也会用到)
  // const root = new Vue(App)
  // temp = Vue.prototype
  // temp.on = root.$on
  // temp.once = root.$once
  // temp.off = root.$off
  // temp.emit = root.$emit
  // setTimeout(() => { root.$mount('#app') })
  // try {
  //   await import(/* webpackChunkName: "junior" */ '@/libs/components/junior')
  //   await import(/* webpackChunkName: "senior" */ '@/libs/components/senior')
  // } catch (error) {
  //   proto.$message.error('资源加载失败, 部分功能将不可用！')
  //   console.error(error)
  // }

  if (router || store) {
    const componentOptions = App.options || App
    componentOptions.router = router
    componentOptions.store = store
  }
  setTimeout(() => new Vue(App).$mount('#app'))
}
