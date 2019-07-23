/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-23 20:48:29
 */
import Vue, { CreateElement, VNode } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/// 全局注册的组件，请尽量不要让这个列表变太长 ///
import { Row, Button, Select } from 'element-ui'
import './scss/element.scss' // 上面的组件的样式
// 全局注册
Vue.use(Row)
Vue.use(Button)
Vue.use(Select)

/* ---------------------- 我是一条分割线 (灬°ω°灬) ---------------------- */

new Vue({
  store,
  router,
  render: (h: CreateElement): VNode => h(App),
}).$mount('#app')
