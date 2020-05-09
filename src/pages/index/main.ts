/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import router from './router'
import store from './store'
import Vue from 'vue'
import App from './App'

import { on, off, once, emit } from '@/utils/eventBus'
// import { throttle } from '@/utils/performance'
import { dev } from '@/libs/vue'
import './registerServiceWorker'

/// 全局样式 ///
import '@/scss/icon.scss?skin='
import '@/scss/transitions.scss?skin='

/* ---------------------- 我是一条分割线 (灬°ω°灬) ---------------------- */

let temp
temp = Vue.prototype

/// eventBus 注入 ///
temp.on = on
temp.off = off
temp.once = once
temp.emit = emit

/// 埋点 ///
// if (process.env.NODE_ENV === 'production') {
//   Vue.config.errorHandler = function(err, vm, info) {
//     // 采集并上传错误日志
//   }
//   const data: IObject[] = []
//   window.addEventListener(
//     'mousemove',
//     throttle((e: MouseEvent) => {
//       // 页面地址&鼠标位置 可用于统计(比如热力图)用户关注的页面及功能
//       data.push({ url: location.href, x: e.pageX, y: e.pageY })
//     }, 3000)
//   )
//   window.addEventListener('beforeunload', () => {
//     submit(data) // 上传数据
//   })
// }

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
setTimeout(() => {
  // new Vue({
  //   store,
  //   router,
  //   render: (h: CreateElement): VNode => h(App),
  // }).$mount('#app')
  // hack: 省root组件
  temp = App.options || App
  temp.store = store
  temp.router = router
  new Vue(App).$mount('#app')
})
