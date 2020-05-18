/** 视图索引 统一类型: (options?: Object) => RouteConfig
 * meta: {
 *  name 对应标题/位置导航
 *  alive 路由最大缓存时间
 *  reload 下次访问路由是否需要重新加载
 * }
 */
import { RouteConfig } from 'vue-router'

import { getAsync } from '@com/hoc'
// import RouterViewTransparent from '@com/RouterViewTransparent'

/** 首页 */
export const home = () =>
  ({
    path: '/home',
    meta: { name: '首页' },
    component: getAsync(() => import(/* webpackChunkName: "oHome" */ './Home')),
  } as RouteConfig)

/** 关于 */
export const about = () =>
  ({
    path: '/about',
    meta: { name: '关于' },
    component: getAsync(() =>
      import(/* webpackChunkName: "oAbout" */ './About')
    ),
  } as RouteConfig)
