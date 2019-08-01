<!--
 * @Description: 模块六
 * @Author: 毛瑞
 * @Date: 2019-07-08 12:51:49
 -->
<template>
  <div :class="$style.wrapper">
    <StarWarp :class="$style.star" />
    <TwoRotate />
  </div>
</template>

<script lang="ts">
import TwoRotate from '@indexCom/visual/TwoRotate'
import StarWarp from '@indexCom/visual/StarWarp'

// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

// const UPPER_CASE:string|number|any[] // 常量
// const camelCase:any // 单例
// function utils() {} // 函数(无副作用)

/// name,components,directives,filters,extends,mixins ///
@Component({
  components: { TwoRotate, StarWarp },
})
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  /// private instance attributes (private name?: string // 非响应式属性) ///
  /// computed (get name() { return this.name } set name()... ///
  /// watch (@Watch) ///
  /// LifeCycle (beforeCreate/created/.../destroyed) ///
  /// methods (private/public) ///
  /// render ///
}
</script>

<style lang="scss" module>
.wrapper {
  width: 100%;
  height: 100%;
  padding: 10% 0;
  box-sizing: border-box;

  > canvas {
    width: 100%;
    height: 100%;
  }
}
.star {
  top: 0;
  left: 0;
  position: absolute;
}
</style>
