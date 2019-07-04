/*
 * @Description: 路由管理
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-04 21:41:25
 */
import Vue from 'vue'
import Router from 'vue-router'

import { IObject } from '@/types'
import CONFIG from '@/config/router/other'

Vue.use(Router) // 全局注册

const ROUTER = CONFIG as IObject<any>

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: `/${ROUTER.home.name}`,
      name: ROUTER.home.name,
      component: () =>
        import(/* webpackChunkName: "oHome" */ './views/Home.vue'),
    },
    {
      path: `/${ROUTER.about.name}`,
      name: ROUTER.about.name,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "oAbout" */ './views/About.vue'),
    },

    // 默认重定向到首页去
    {
      path: '*',
      redirect: `/${ROUTER.home.name}`,
    },
  ],
})

// 可以引入store根据用户权限控制跳转
router.beforeEach((to, from, next) => {
  // 设置页面标题
  const name: string | undefined = to.name
  let key: string
  let tmp: any
  for (key in ROUTER) {
    tmp = ROUTER[key]
    if (tmp && tmp.name === name) {
      document.title = tmp.title
      break
    }
  }

  next() // 不调用则不跳转
})

export default router
