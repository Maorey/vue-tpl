/**
 * @Description: 透明分发路由(支持嵌套)
 * @Author: 毛瑞
 * @Date: 2020-01-14 23:47:39
 */
import { Component } from 'vue'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import getKey from '@/utils/getKey'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )

/** 透明分发路由(支持嵌套)
 *    以下情况可以给个key防止复用:
 *    <KeepAlive>
 *      <RouterView :key="$route.meta.code" />
 *    <KeepAlive />
 */
export default {
  name: 'RVT',
  data() {
    return { d: 0 } // 是否失活/休眠
  },
  activated(this: any) {
    this.d = 0
  },
  deactivated(this: any) {
    this.d = 1
  },
  render(this: any, h) {
    const exclude = this.$router.$.e // for 依赖收集
    const meta = this.$route.meta // for 依赖收集

    return this.d // for 依赖收集
      ? this.c
      : (this.c = h('KeepAlive', { props: { max: 5, exclude } }, [
        h('RouterView', { key: meta.k || (meta.k = getKey()) }),
      ]))
  },
} as Component
