/** 复用视图 统一类型: (options?: Object) => RouteConfig
 * meta: {
 *  name 对应标题/位置导航
 *  alive 路由最大缓存时间
 *  reload 下次访问路由是否需要重新加载
 * }
 */
// import { RouteConfig } from 'vue-router'

// import { getAsync } from '@com/hoc'
// import RVT from '@com/RouterViewTransparent'

// /** foo 视图 */
// export const foo = () =>
//   ({
//     path: '',
//     meta: {},
//     component: RVT,
//     children: [
//       {
//         path: '',
//         meta: {},
//         component: getAsync(() =>
//           import(/* webpackChunkName: "foo" */ './Foo')
//         ),
//       },
//     ],
//   } as RouteConfig)
