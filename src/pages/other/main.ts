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
import Row from 'element-ui/lib/row'
import Col from 'element-ui/lib/col'
import Container from 'element-ui/lib/container'
import Aside from 'element-ui/lib/aside'
import Main from 'element-ui/lib/main'
import Button from 'element-ui/lib/button'
import Link from 'element-ui/lib/link'
import Select from 'element-ui/lib/select'

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
    render: (h: CreateElement): VNode => h(App),
  }).$mount('#app')
)
