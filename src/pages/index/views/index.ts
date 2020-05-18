/** 视图索引 统一类型: (options?: Object) => RouteConfig
 * meta: {
 *  name 对应标题/位置导航
 *  thumb 缩略图
 *  alive 路由最大缓存时间
 *  reload 下次访问路由是否需要重新加载
 * }
 */
import { RouteConfig } from 'vue-router'

import { getAsync } from '@com/hoc'
// import RouterViewTransparent from '@com/RouterViewTransparent'

import IMG_HOME from '@index/assets/home.png'
import IMG_ABOUT from '@index/assets/about.png'

/** 首页 */
export const home = () =>
  ({
    path: '/home',
    meta: { name: '首页', thumb: IMG_HOME },
    component: getAsync(
      () => import(/* webpackChunkName: "iHome" */ './Home') as any
    ),
    // 嵌套路由:
    // component: RouterViewTransparent,
    // children: [
    //   {
    //     path: '',
    //     meta: { name: '示例' },
    //     component: getAsync(() =>
    //       import(/* webpackChunkName: "iHome" */ './Home')
    //     ),
    //   },
    //   {
    //     path: ':id',
    //     meta: { name: '详情' },
    //     // props: { be: 'detail' },
    //     component: getAsync(() =>
    //       import(/* webpackChunkName: "iHome" */ './Home/Detail')
    //     ),
    //   },
    // ],
  } as RouteConfig)

/** 关于 */
export const about = () =>
  ({
    path: '/about',
    meta: { name: '关于', thumb: IMG_ABOUT },
    component: getAsync(() =>
      import(/* webpackChunkName: "iAbout" */ './About')
    ),
  } as RouteConfig)
