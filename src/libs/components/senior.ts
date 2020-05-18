/** 注册全局组件 */
import Vue from 'vue' // 单例

/// 全局注册的组件，请尽量不要让这个列表变太长, 【影响入口大小】 ///
// 常用
import Button from 'element-ui/lib/button'
import ButtonGroup from 'element-ui/lib/button-group'
import Link from 'element-ui/lib/link'
import Divider from 'element-ui/lib/divider'
import Card from 'element-ui/lib/card'
// 滚动面板【隐藏组件】
import Scrollbar from 'element-ui/lib/scrollbar'
// 表单
import Form from 'element-ui/lib/form'
import FormItem from 'element-ui/lib/form-item'
import Input from 'element-ui/lib/input'
import Autocomplete from 'element-ui/lib/autocomplete'
import Select from 'element-ui/lib/select'
import Option from 'element-ui/lib/option'
import OptionGroup from 'element-ui/lib/option-group'
import Checkbox from 'element-ui/lib/checkbox'
import CheckboxGroup from 'element-ui/lib/checkbox-group'
// 弹窗
import Dialog from 'element-ui/lib/dialog'

import hackScrollbar from '@/libs/enhancers/scrollbar'
import hackFormItem from '@/libs/enhancers/formItem'
import hackDialog from '@/libs/enhancers/dialog'

/// 注册全局组件 ///
// 基础
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Link)
Vue.use(Divider)
Vue.use(Card)

// 滚动面板【隐藏组件】
Vue.use(hackScrollbar(Scrollbar))

// 表单
Vue.use(Form)
Vue.use(hackFormItem(FormItem))
Vue.use(Input)
Vue.use(Autocomplete)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)

// 弹窗
Vue.use(hackDialog(Dialog))
