/**
 * @Description: 透明分发路由(依赖路由环境)
 * @Author: 毛瑞
 * @Date: 2020-01-14 23:47:39
 */
import { Component } from 'vue'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )

export default {
  name: 'RVT',
  beforeCreate(this: any) {
    this.k = this.$route.meta.code
  },
  render(this: any, h) {
    const meta = this.$route.meta // for 依赖收集

    return h(
      'KeepAlive',
      { key: this.k, props: { max: 3, exclude: this.$router.$.e } },
      [
        h('RouterView', {
          key: meta.code === this.k ? (this.n = meta.name) : this.n,
        }),
      ]
    )
  },
} as Component
