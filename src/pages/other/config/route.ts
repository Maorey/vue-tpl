/*
 * @Description: other页路由配置
 * @Author: 毛瑞
 * @Date: 2019-07-01 16:26:36
 */
import { getAsync } from '@/utils/highOrder' // 高阶组件工具

export default {
  /*! 【other页路由配置(https://router.vuejs.org/zh/api/#router-构建选项)】 */

  mode: 'hash',
  meta: {
    /*! 默认页 */
    /** 默认页
     */
    home: '/home',

    /*! 标题 */
    /** 标题
     */
    name: 'vue-tpl',
  },
  routes: [
    {
      /*! 首页 */

      path: '/home',
      meta: {
        code: 'home', // 唯一标识, 作为根路由的key
        name: '首页',
      },
      component: getAsync(() =>
        import(/* webpackChunkName: "oHome" */ '@other/views/Home')
      ),
      // 嵌套路由(children)由meta.name唯一标识
    },
    {
      /*! 关于 */

      path: '/about',
      meta: {
        code: 'about',
        name: '关于',
      },
      component: getAsync(() =>
        import(/* webpackChunkName: "oAbout" */ '@other/views/About')
      ),
    },
  ],
}
