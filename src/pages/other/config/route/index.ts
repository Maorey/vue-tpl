/*
 * @Description: other页路由配置
 * @Author: 毛瑞
 * @Date: 2019-07-01 16:26:36
 */
import { getAsync } from '@com/hoc' // 高阶组件工具
// import RouterViewTransparent from '@com/RouterViewTransparent'

export default {
  /*! 【other页路由配置(https://router.vuejs.org/zh/api/#router-构建选项)】
   * meta: {
   *  name 对应标题/位置导航
   *  alive 路由最大缓存时间
   *  reload 下次访问路由是否需要重新加载
   * }
   */

  mode: 'hash',
  meta: {
    /*! 默认页 */ home: '/home',
    /*! 标题 */ name: 'vue-tpl',
  },
  routes: [
    {
      /*! 首页 */

      path: '/home',
      meta: { name: '首页' },
      component: getAsync(() =>
        import(/* webpackChunkName: "oHome" */ '@other/views/Home')
      ),
      // 嵌套路由
      // component: RouterViewTransparent,
      // children: [
      //   {
      //     path: '',
      //     meta: { name: '示例' },
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
      //     meta: { name: '详情' },
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
      meta: { name: '关于' },
      component: getAsync(() =>
        import(/* webpackChunkName: "oAbout" */ '@other/views/About')
      ),
    },
  ],
}
