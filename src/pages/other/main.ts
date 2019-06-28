/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-27 16:42:24
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-28 15:52:42
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

new Vue({
  store,
  router,
  ...App,
}).$mount('#app')
