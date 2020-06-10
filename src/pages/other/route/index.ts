/** 路由配置 */
import { RouterOptions } from 'vue-router'

import CONF from '@/config'
import CONFIG from '@other/config'
import { home, about } from '@other/views'

export default {
  mode: CONF.mode,
  base: CONFIG.base,
  meta: { home: '/home', name: 'vue-tpl' },
  /** 滚动行为, 仅<body>, 不能处理指定元素的滚动 */
  scrollBehavior(to, from, savedPosition) {
    return to.hash ? { selector: to.hash } : savedPosition
  },
  routes: [home({ id: '0', name: '首页' }), about({ id: '1', name: '关于' })],
} as RouterOptions
