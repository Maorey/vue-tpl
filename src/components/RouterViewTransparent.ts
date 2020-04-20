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
 *    可以给个key防止<RVT>复用:
 *    <KeepAlive>
 *      <RouterView :key="$route.meta.code" />
 *    <KeepAlive />
 */
export default {
  name: 'RVT',
  data() {
    return { d: 0 } // 是否失活/离开
  },
  beforeRouteUpdate(this: any, to, from, next) {
    this.d = 0
    setTimeout(next)
  },
  activated(this: any) {
    this.d = 0
  },
  beforeRouteLeave(this: any, to, from, next) {
    this.d = to.matched.length // for 刷新
    setTimeout(next)
  },
  deactivated(this: any) {
    this.d = 1
  },
  render(this: any, h) {
    if (this.d) {
      return this.c
    }

    const exclude = this.$router.$.e
    const meta = this.$route.meta

    return (this.c = h('KeepAlive', { props: { max: 5, exclude } }, [
      h(
        'RouterView',
        { key: meta.k || (meta.k = getKey()) },
        this.$slots.default
      ),
    ]))
  },
} as Component
