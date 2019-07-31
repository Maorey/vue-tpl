<!--
 * @Description: 左右运动的圆
 * @Author: 毛瑞
 * @Date: 2019-07-31 19:08:55
 -->
<template>
  <div />
</template>

<script lang="ts">
import CONFIG from '@index/config'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

/// 按需引入zrender (参考 ~zrender/index.js ) ///
import { init } from 'zrender/lib/zrender' // 核心
import { Circle } from 'zrender/lib/export' // 可选
// const zrender = { init, Circle } // 这样就和文档的使用方式一致了

const INTERVAL = CONFIG.redraw

/// name,components,directives,filters,extends,mixins ///
@Component
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  /// private instance attributes (private name?: string // 非响应式属性) ///
  /// computed (get name() { return this.name } set name()... ///
  /// watch (@Watch) ///
  /// LifeCycle (beforeCreate/created/.../destroyed) ///
  private mounted() {
    const zr = init(this.$el)

    const w = zr.getWidth()
    const h = zr.getHeight()

    const r = 30
    const circle = new Circle({
      shape: {
        cx: r,
        cy: h / 2,
        r: r,
      },
      style: {
        fill: 'transparent',
        stroke: '#FF6EBE',
      },
      silent: true,
    })

    circle
      .animate('shape', true)
      .when(5000, {
        cx: w - r,
      })
      .when(10000, {
        cx: r,
      })
      .start()

    zr.add(circle)
  }
  /// methods (private/public) ///
  /// render ///
}
</script>
