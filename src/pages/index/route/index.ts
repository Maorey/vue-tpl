/** 路由配置 */
import { RouterOptions } from 'vue-router'

import CONF, { SPA } from '@/config'
import CONFIG from '@index/config'
import { home, about } from '@index/views'

import IMG_HOME from '@index/assets/home.png'
import IMG_ABOUT from '@index/assets/about.png'

export default {
  mode: CONF.mode,
  base: CONFIG.base,
  meta: { home: '/home', name: 'vue-tpl' },
  /** 滚动行为, 仅<body>, 不能处理指定元素的滚动 */
  scrollBehavior(to, from, savedPosition) {
    return to.hash ? { selector: to.hash } : savedPosition
  },
  routes: [
    home({ id: '0', name: '首页', thumb: IMG_HOME }),
    about({ id: '1', name: '关于', thumb: IMG_ABOUT }),
    // 子站跳转
    {
      path: '/other',
      meta: { id: SPA.other },
      redirect() {
        CONF.g(SPA.other)
      },
    },
  ],
} as RouterOptions
