/*
 * @Description: index页路由配置
 * @Author: 毛瑞
 * @Date: 2019-07-01 16:26:36
 */
import { getAsync } from '@/utils/highOrder' // 高阶组件工具

// import CONFIG from '@/config'
// import { get } from '@/utils/cookie' // 先执行一次 未登录尽快跳转

// // 初始执行一次检查登陆
// if (!get(CONFIG.token)) {
//   // 跳转到登陆页
//   try {
//     window.stop() // 停止加载资源
//   } catch (error) {}
//   location.href = ROUTE.meta.login
//   throw new Error() // 阻止后续代码执行
// }

export default {
  /*! 【index页路由配置(https://router.vuejs.org/zh/api/#router-构建选项)】↓ */

  mode: 'hash',
  meta: {
    /*! 默认页 */ home: '/home',
    /*! 标题 */ title: 'vue-tpl',
  },
  routes: [
    {
      /*! 首页 */

      path: '/home',
      meta: {
        title: '首页',
        thumb: require('@index/assets/home.png'),
      },
      component: getAsync(() =>
        import(/* webpackChunkName: "iHome" */ '@index/views/Home')
      ),
    },
    {
      /*! 关于 */

      path: '/about',
      meta: {
        title: '关于',
        thumb: require('@index/assets/about.png'),
      },
      component: getAsync(() =>
        import(/* webpackChunkName: "iAbout" */ '@index/views/About')
      ),
    },
  ],

  /*! 【index页路由配置↑】 */
}
