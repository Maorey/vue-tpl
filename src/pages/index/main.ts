/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue, { CreateElement, VNode } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

new Vue({
  store,
  router,
  render: (h: CreateElement): VNode => h(App),
}).$mount('#app')
