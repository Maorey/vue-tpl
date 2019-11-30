/*
 * @Description: index页路由配置
 * @Author: 毛瑞
 * @Date: 2019-07-01 16:26:36
 */
import { getAsync } from '@/utils/highOrder' // 高阶组件工具

// import IMG_HOME from '@index/assets/home.png'
import IMG_ABOUT from '@index/assets/about.png'

/* eslint-disable comma-dangle */
export default {
  /*! 【index页路由配置(https://router.vuejs.org/zh/api/#router-构建选项)】 */

  mode: 'hash',
  meta: {
    /*! 默认页 */ home: '/home',
    /*! 标题 */ name: 'vue-tpl',
  },
  routes: [
    // {
    //   /*! 首页 */

    //   path: '/home',
    //   meta: {
    //     name: '首页',
    //     thumb: IMG_HOME,
    //   },
    //   component: getAsync(
    // eslint-disable-next-line max-len
    //     () => import(/* webpackChunkName: "iHome" */ '@index/views/Home') as any
    //   ),
    // },
    {
      /*! 关于 */

      path: '/about',
      meta: {
        name: '关于',
        thumb: IMG_ABOUT,
      },
      component: getAsync(() =>
        import(/* webpackChunkName: "iAbout" */ '@index/views/About')
      ),
    },
  ],
}
