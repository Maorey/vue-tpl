import CONF, { SPA } from '@/config'
import CONFIG from '@other/config'
import { about, home } from '@other/views'
/** 路由配置 */
import { RouterOptions } from 'vue-router'

export default {
  mode: CONF.mode,
  base: CONFIG.base,
  meta: { home: '/home', name: 'vue-tpl' },
  /** 滚动行为, 仅<body>, 不能处理指定元素的滚动 */
  scrollBehavior(to, from, savedPosition) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return !to.meta!.parent && (to.hash ? { selector: to.hash } : savedPosition)
  },
  routes: [
    home({ id: '0', name: '首页' }),
    about({ id: '1', name: '关于' }),
    // 子站跳转
    {
      path: '/index',
      meta: { id: SPA.index },
      redirect() {
        CONF.g(SPA.index)
      },
    },
  ],
} as RouterOptions
