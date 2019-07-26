/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue, { CreateElement, VNode } from 'vue'
import App from './App'
import router from './router'
import store from './store'

/// 全局注册的组件，请尽量不要让这个列表变太长 ///
import {
  Row,
  Col,
  Container,
  Aside,
  Main,
  Button,
  Link,
  Select,
} from 'element-ui'
import 'element-ui/packages/theme-chalk/src/base.scss'

import 'element-ui/packages/theme-chalk/src/row.scss'
import 'element-ui/packages/theme-chalk/src/col.scss'
import 'element-ui/packages/theme-chalk/src/container.scss'
import 'element-ui/packages/theme-chalk/src/aside.scss'
import 'element-ui/packages/theme-chalk/src/main.scss'

import 'element-ui/packages/theme-chalk/src/button.scss'
import 'element-ui/packages/theme-chalk/src/link.scss'
import 'element-ui/packages/theme-chalk/src/select.scss'

Vue.use(Row)
Vue.use(Col)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Button)
Vue.use(Link)
Vue.use(Select)

/* ---------------------- 我是一条分割线 (灬°ω°灬) ---------------------- */

new Vue({
  store,
  router,
  render: (h: CreateElement): VNode => h(App),
}).$mount('#app')
