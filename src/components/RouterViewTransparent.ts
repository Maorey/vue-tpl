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
  },
  render(this: any, h) {
    this.d.props.exclude = (this.$route.meta.$ || 0).e // for 依赖收集
    return h('KeepAlive', this.d, [h('RouterView')])
  },
} as Component
