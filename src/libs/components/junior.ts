/** 注册基础全局组件 */
import Vue from 'vue' // 单例

/// 全局注册的组件，请尽量不要让这个列表变太长, 【影响入口大小】 ///

// 布局
import Row from 'element-ui/lib/row'
import Col from 'element-ui/lib/col'
import Container from 'element-ui/lib/container'
import Aside from 'element-ui/lib/aside'
import Main from 'element-ui/lib/main'
// loading和消息
import Loading from 'element-ui/lib/loading'
import Tooltip from 'element-ui/lib/tooltip'
import Popover from 'element-ui/lib/popover'
import Message from 'element-ui/lib/message'
import MessageBox from 'element-ui/lib/message-box'
import Notification from 'element-ui/lib/notification'

/// 注册全局组件 ///
const proto = Vue.prototype

// 布局
Vue.use(Row)
Vue.use(Col)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
// loading和消息
Vue.use(Loading.directive)
proto.$loading = Loading.service
Vue.use(Tooltip)
Vue.use(Popover)
proto.$msgbox = MessageBox
proto.$alert = MessageBox.alert
proto.$confirm = MessageBox.confirm
proto.$prompt = MessageBox.prompt
proto.$notify = Notification
proto.$message = Message
