/*
 * @Description: 路由管理
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue from 'vue'
import Router from 'vue-router'

import { IObject } from '@/types'
import { getAsync } from '@/utils/highOrder' // 高阶组件工具

import CONFIG from '@/config/router/index'

Vue.use(Router) // 全局注册

const ROUTER = CONFIG as IObject

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: `/${ROUTER.home.name}`,
      name: ROUTER.home.name,
      component: getAsync(() =>
        import(/* webpackChunkName: "iHome" */ '@index/views/Home')
      ),
    },
    {
      path: `/${ROUTER.about.name}`,
      name: ROUTER.about.name,
      component: getAsync(() =>
        import(/* webpackChunkName: "iAbout" */ '@index/views/About')
      ),
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
