<!--
 * @Description: 波浪
 * @Author: 毛瑞
 * @Date: 2019-08-01 14:55:24
 -->
<template>
  <canvas />
</template>

<script lang="ts">
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'
import Ripple from './ripple'

/// name,components,directives,filters,extends,mixins ///
@Component
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  /// private instance attributes (private name?: string // 非响应式属性) ///
  /// computed (get name() { return this.name } set name()... ///
  /// watch (@Watch) ///
  /// LifeCycle (protected beforeCreate/created/.../destroyed) ///
  /// methods (private/public) ///
  protected mounted() {
    new Ripple().start({ canvas: this.$el as HTMLCanvasElement })
  }
  /// render ///
}
</script>
