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
import './scss/main.scss'

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
