/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue, { CreateElement, VNode } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/// 全局注册的组件，请尽量不要让这个列表变太长 ///
import { Row, Button, Select } from 'element-ui'
import 'element-ui/packages/theme-chalk/src/row.scss'
import 'element-ui/packages/theme-chalk/src/icon.scss'
import 'element-ui/packages/theme-chalk/src/button.scss'
import 'element-ui/packages/theme-chalk/src/select.scss'

Vue.use(Row)
Vue.use(Button)
Vue.use(Select)

/* ---------------------- 我是一条分割线 (灬°ω°灬) ---------------------- */

new Vue({
  store,
  router,
  render: (h: CreateElement): VNode => h(App),
}).$mount('#app')
