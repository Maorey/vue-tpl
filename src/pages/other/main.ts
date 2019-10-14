/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import router from './router'
import store from './store'
import Vue, { CreateElement, VNode } from 'vue'
import App from './App'
import prefer from './store/modules/prefer'
import './registerServiceWorker'

/// 全局注册的组件，请尽量不要让这个列表变太长 ///
// 布局
import Row from 'element-ui/lib/row'
import Col from 'element-ui/lib/col'
import Container from 'element-ui/lib/container'
import Aside from 'element-ui/lib/aside'
import Main from 'element-ui/lib/main'
// 基础
import Button from 'element-ui/lib/button'
import Link from 'element-ui/lib/link'
import Loading from 'element-ui/lib/loading'
// 提示
import Tooltip from 'element-ui/lib/tooltip'
import Popover from 'element-ui/lib/popover'
import Message from 'element-ui/lib/message'
import MessageBox from 'element-ui/lib/message-box'
import Notification from 'element-ui/lib/notification'

import './scss/main.scss' // 全局样式

// 布局
Vue.use(Row)
Vue.use(Col)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
// 基础
Vue.use(Button)
Vue.use(Link)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
// 提示
Vue.use(Tooltip)
Vue.use(Popover)
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

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
