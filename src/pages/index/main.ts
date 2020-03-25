/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import router from './router'
import store from './store'
import Vue from 'vue'
import App from './App'
// import { throttle } from '@/utils/performance'
import './registerServiceWorker'

/// 全局样式 ///
import '@/scss/icon.scss?skin='
import '@/scss/transitions.scss?skin='

/* ---------------------- 我是一条分割线 (灬°ω°灬) ---------------------- */

/// 错误日志采集 ///
// if (process.env.NODE_ENV === 'production') {
//   Vue.config.errorHandler = function(err, vm, info) {
//     // 采集并上传错误日志
//   }
// }

/// 埋点 ///
// const data: IObject[] = []
// window.addEventListener(
//   'mousemove',
//   throttle((e: MouseEvent) => {
//     // 页面地址&鼠标位置 可用于统计(比如热力图)用户关注的页面及功能
//     data.push({ url: location.href, x: e.pageX, y: e.pageY })
//   }, 3000)
// )
// window.addEventListener('beforeunload', () => {
//   submit(data) // 上传数据
// })

// 在浏览器开发工具的性能/时间线面板中启用Vue组件性能追踪 && 更友好的组件名(vue-devtool)
;(Vue.config.performance = process.env.NODE_ENV === 'development') &&
  Vue.mixin({
    beforeCreate() {
      let options
      options = this.$options
      options ||
        ((options = this.$vnode) &&
          (options = options.componentOptions) &&
          (options = options.Ctor) &&
          (options = (options as any).options))

      // 匿名组件就不处理了 vue-devtool自己找 $vm0.$options.__file
      if (options && options.__file && /^default/i.test(options.name)) {
        const result = /(?:[\\/]([^\\/]+)[\\/])?([^\\/]+)(?:[\\/]index)?\.\w+/.exec(
          options.__file
        )
        result && (options.name = result[1] + result[2])
      }
    },
  })

// 防阻塞页面（defer的脚本已缓存时不会非阻塞执行bug:chromium#717979）
setTimeout(() => {
  // new Vue({
  //   store,
  //   router,
  //   render: (h: CreateElement): VNode => h(App),
  // }).$mount('#app')
  // hack: 省root组件
  const options = App.options || App
  options.store = store
  options.router = router
  new Vue(App).$mount('#app')
})
