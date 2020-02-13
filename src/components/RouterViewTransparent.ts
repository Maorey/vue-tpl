/**
 * @Description: 透明分发路由(依赖路由环境)
 * @Author: 毛瑞
 * @Date: 2020-01-14 23:47:39
 */
import { Component } from 'vue'

let counter = 0
export default {
  name: 'RVT',
  beforeCreate(this: any) {
    this.$vnode.data.key = counter++ // hack key
  },
  created(this: any) {
    this.d = { props: { max: 5 } }
    this.k = { key: 0 }
  },
  render(this: any, h) {
    const meta = this.$route.meta
    this.d.props.exclude = (meta.$ || 0).e // for 依赖收集
    this.k.key = meta.name

    return h('KeepAlive', this.d, [h('RouterView', this.k)])
  },
} as Component
