/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue, { CreateElement, VNode } from 'vue'
import App from './App'
import router from './router'
import store from './store'
import prefer from './store/modules/prefer'
import './registerServiceWorker'

/* ---------------------- 我是一条分割线 (灬°ω°灬) ---------------------- */

/// 错误日志采集 ///
// if (process.env.NODE_ENV === 'production') {
//   Vue.config.errorHandler = function(err, vm, info) {
//     // 采集并上传错误日志
//   }
// }

// 防阻塞页面（defer的脚本已缓存时不会非阻塞执行bug:chromium#717979）
setTimeout(() =>
  new Vue({
    store,
    router,
    created() {
      prefer.setSkin() // 初始化皮肤
    },
    render: (h: CreateElement): VNode => h(App),
  }).$mount('#app')
)
