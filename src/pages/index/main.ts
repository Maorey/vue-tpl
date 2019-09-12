/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue, { CreateElement, VNode } from 'vue'
import App from './App'
import router from './router'
import store from './store'

// 防阻塞页面
setTimeout(() =>
  new Vue({
    store,
    router,
    render: (h: CreateElement): VNode => h(App),
  }).$mount('#app')
)
