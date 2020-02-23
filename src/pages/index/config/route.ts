/*
 * @Description: index页路由配置
 * @Author: 毛瑞
 * @Date: 2019-07-01 16:26:36
 */
import { getAsync } from '@/utils/highOrder' // 高阶组件工具
// import RouterViewTransparent from '@com/RouterViewTransparent'

import IMG_HOME from '@index/assets/home.png'
import IMG_ABOUT from '@index/assets/about.png'

export default {
  /*! 【index页路由配置(https://router.vuejs.org/zh/api/#router-构建选项)】 */

  mode: 'hash',
  meta: {
    /*! 默认页 */ home: '/home',
    /*! 标题 */ name: 'vue-tpl',
  },
  routes: [
    {
      /*! 首页 */

      path: '/home',
      meta: {
        code: 'home', // 唯一标识, 作为component的key
        name: '首页', // 标题
        thumb: IMG_HOME,
      },
      component: getAsync(
        () => import(/* webpackChunkName: "iHome" */ '@index/views/Home') as any
      ),
      // 嵌套路由
      // component: RouterViewTransparent,
      // children: [
      //   {
      //     path: '',
      //     meta: {
      //       code: 'home', // 同父component
      //       name: '示例', // 标题及唯一标识子component
      //     },
      //     component: getAsync(
      //       () =>
      //         import(
      //           /* webpackChunkName: "iHome" */
      //           '@index/views/Home'
      //         ) as any
      //     ),
      //   },
      //   {
      //     path: ':id',
      //     meta: { code: 'home', name: '详情' },
      //     // props: { be: 'detail' },
      //     component: getAsync(
      //       () =>
      //         import(
      //           /* webpackChunkName: "iHome" */
      //           '@index/views/Home/Detail'
      //         ) as any
      //     ),
      //   },
      // ],
    },
    {
      /*! 关于 */

      path: '/about',
      meta: {
        code: 'about',
        name: '关于',
        thumb: IMG_ABOUT,
      },
      component: getAsync(() =>
        import(/* webpackChunkName: "iAbout" */ '@index/views/About')
      ),
    },
  ],
}
