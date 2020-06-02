/**
 * @Description: 透明分发路由(支持嵌套)
 * @Author: 毛瑞
 * @Date: 2020-01-14 23:47:39
 */
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import CONFIG from '@/config'
import getKey from '@/utils/getKey'
import { sleep } from '@/libs/vue'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** 透明分发路由(支持嵌套), props: { max: number }
 *    可以给个key防止<RVT>复用:
 *    <KeepAlive>
 *      <RouterView :key="$route.meta.id" />
 *    <KeepAlive />
 */
export default sleep({
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  name: 'RVT',
  props: ['route', 'max'],
  render(this: any, h) {
    let max = this.max
    max > 1 || (max = CONFIG.subPage > 1 ? CONFIG.subPage : 1)
    const meta = (this.route || this.$route).meta
    meta.k || (meta.k = getKey('v'))
    return (this.n = h(
      'KeepAlive',
      { props: { exclude: this.$router.$.e, max: max } },
      [h('RouterView', { key: meta.k }, this.$slots.default)]
    ))
  },
})
