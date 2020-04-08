/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
// import { throttle } from '@/utils/performance'
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

import elDialogDragable from '@/libs/elDialogDragable'

/// 全局样式 ///
import 'element-ui/lib/theme-chalk/base.css' // element-ui字体+过渡动画
import '@/scss/base.scss?skin=' // 基础样式
import './scss/main.scss' // 全局皮肤样式

// hack: 不出现滚动条时不显示
let options = Scrollbar.options || Scrollbar
const created = options.components.Bar.created
options.components.Bar.created = function() {
  created && created.apply(this, arguments)
  this.$watch('size', function(this: any, size: string) {
    this.$el.style.display = size && size !== '0' ? '' : 'none'
  })
}
// hack: 表单重设初始值(initialValue)
options = FormItem.options || FormItem
options.mounted = function() {
  if (this.prop) {
    this.dispatch('ElForm', 'el.form.addField', [this])
    Array.isArray((this.initialValue = this.fieldValue)) &&
      (this.initialValue = [this.initialValue])
    this.addValidateEvents()
  }
}
options.methods.setIni = function(model: IObject) {
  for (const field of this.fields) {
    field.initialValue = model[field.prop]
  }
  this.clearValidate()
}
// hack: ElDialog props dragable 默认(true)允许拖拽
elDialogDragable(Dialog)

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

/* ---------------------- 我是一条分割线 (灬°ω°灬) ---------------------- */

/// 错误日志采集 ///
// if (process.env.NODE_ENV === 'production') {
//   Vue.config.errorHandler = function(err, vm, info) {
//     // 采集并上传错误日志
//   }
// }

/// 埋点 ///
// const data: IObject[] = []
// window.addEventListener(
//   'mousemove',
//   throttle((e: MouseEvent) => {
//     // 页面地址&鼠标位置 可用于统计(比如热力图)用户关注的页面及功能
//     data.push({ url: location.href, x: e.pageX, y: e.pageY })
//   }, 3000)
// )
// window.addEventListener('beforeunload', () => {
//   submit(data) // 上传数据
// })

// 在浏览器开发工具的性能/时间线面板中启用Vue组件性能追踪 && 更友好的组件名(vue-devtool)
;(Vue.config.performance = process.env.NODE_ENV === 'development') &&
  Vue.mixin({
    beforeCreate() {
      let options
      options = this.$options
      options ||
        ((options = this.$vnode) &&
          (options = options.componentOptions) &&
          (options = options.Ctor) &&
          (options = (options as any).options))

      // 匿名组件就不处理了 vue-devtool自己找 $vm0.$options.__file
      if (options && options.__file && /^default/i.test(options.name)) {
        const result = /(?:[\\/]([^\\/]+)[\\/])?([^\\/]+)(?:[\\/]index)?\.\w+/.exec(
          options.__file
        )
        result && (options.name = result[1] + result[2])
      }
    },
  })

// 防阻塞页面（defer的脚本已缓存时不会非阻塞执行bug:chromium#717979）
setTimeout(() => {
  // new Vue({
  //   store,
  //   router,
  //   render: (h: CreateElement) => h(App),
  // }).$mount('#app')
  // hack: 省root组件
  options = App.options || App
  options.store = store
  options.router = router
  new Vue(App).$mount('#app')
})
