/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
// import prefer from './store/modules/prefer'
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
import ButtonGroup from 'element-ui/lib/button-group'
import Link from 'element-ui/lib/link'
import Loading from 'element-ui/lib/loading'
import Divider from 'element-ui/lib/divider'
import Card from 'element-ui/lib/card'
// 弹窗&表单
import Dialog from 'element-ui/lib/dialog'
import Form from 'element-ui/lib/form'
import FormItem from 'element-ui/lib/form-item'
import Input from 'element-ui/lib/input'
import Autocomplete from 'element-ui/lib/autocomplete'
import Select from 'element-ui/lib/select'
import Option from 'element-ui/lib/option'
import OptionGroup from 'element-ui/lib/option-group'
// 提示
import Tooltip from 'element-ui/lib/tooltip'
import Popover from 'element-ui/lib/popover'
import Message from 'element-ui/lib/message'
import MessageBox from 'element-ui/lib/message-box'
import Notification from 'element-ui/lib/notification'
// 滚动面板【隐藏组件】
import Scrollbar from 'element-ui/lib/scrollbar'

import './scss/main.scss' // 全局样式

// 布局
Vue.use(Row)
Vue.use(Col)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
// 基础
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Link)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.use(Divider)
Vue.use(Card)
// 弹窗&表单
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Autocomplete)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
// 提示
Vue.use(Tooltip)
Vue.use(Popover)
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
// 滚动面板
Vue.use(Scrollbar)
// hack: 不出现滚动条时不显示
const created = Scrollbar.components.Bar.created
Scrollbar.components.Bar.created = function() {
  created && created.apply(this, arguments)
  this.$watch('size', function(this: any, size: string) {
    this.$el.style.display = size && size !== '0' ? '' : 'none'
  })
}

/* ---------------------- 我是一条分割线 (灬°ω°灬) ---------------------- */

/// 错误日志采集 ///
// if (process.env.NODE_ENV === 'production') {
//   Vue.config.errorHandler = function(err, vm, info) {
//     // 采集并上传错误日志
//   }
// }

// 防阻塞页面（defer的脚本已缓存时不会非阻塞执行bug:chromium#717979）
setTimeout(() => {
  // new Vue({
  //   store,
  //   router,
  //   created() {
  //     prefer.setSkin() // 设置皮肤
  //   },
  //   render: (h: CreateElement) => h(App),
  // }).$mount('#app')
  // hacky: 省root组件
  const options = App.options || App
  options.store = store
  options.router = router
  // 设置皮肤
  // const created = App.created
  // App.created = function() {
  //   created && created.apply(this, arguments)
  //   prefer.setSkin()
  // }
  new Vue(App).$mount('#app')
})
