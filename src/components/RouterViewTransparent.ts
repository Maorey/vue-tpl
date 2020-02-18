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
    this.a = this.$router
    this.b = this.$route.meta
    this.c = this.$vnode.data.key || this.b.code
    this.d = { key: this.c, props: { max: 3 } }
  },
  render(this: any, h) {
    const meta = this.a.currentRoute.meta

    this.d.props.exclude = (this.b.$ || 0).e // for 依赖收集
    this.c === meta.code && (this.e = meta.name)

    return h('KeepAlive', this.d, [h('RouterView', { key: this.e })])
  },
} as Component
