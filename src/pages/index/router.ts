import Vue from 'vue'
import Router from 'vue-router'

import CONFIG from '@/config/router'

const ROUTER: any = CONFIG // 使允许 for in...

Vue.use(Router) // 全局注册

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: `/${ROUTER.home.name}`,
      name: ROUTER.home.name,
      component: () =>
        import(/* webpackChunkName: "iHome" */ './views/Home.vue'),
    },
    {
      path: `/${ROUTER.about.name}`,
      name: ROUTER.about.name,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "iAbout" */ './views/About.vue'),
    },

    // 默认重定向到首页去
    {
      path: '*',
      redirect: `/${ROUTER.home.name}`,
    },
  ],
})

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

  next()
})

export default router
