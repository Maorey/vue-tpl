/** 模块索引 */
import { getAsync } from '@com/hoc'
import { ModuleFactory } from '@/functions/router/module'

/** 首页 */
export const home: ModuleFactory = meta => ({
  path: '/home',
  meta,
  component: getAsync(() => import(/* webpackChunkName: "oHome" */ './Home')),
})

/** 关于 */
export const about: ModuleFactory = meta => ({
  path: '/about',
  meta,
  component: getAsync(() => import(/* webpackChunkName: "oAbout" */ './About')),
})
