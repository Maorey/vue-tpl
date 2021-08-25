<!--
 * @Description: 模块五
 * @Author: 毛瑞
 * @Date: 2019-07-08 12:51:49
 -->
<template>
  <BubblePop :class="$style.wrapper" />
</template>

<script lang="ts">
import BubblePop from '@indexCom/visual/Bubble'

// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

// const UPPER_CASE:string|number|any[] // 常量
// const camelCase:any // 单例
// function utils() {} // 函数(无副作用)

/// name,components,directives,filters,extends,mixins ///
@Component({
  components: { BubblePop },
})
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  /// private instance attributes (private name?: string // 非响应式属性) ///
  /// computed (get name() { return this.name } set name()... ///
  /// watch (@Watch) ///
  /// LifeCycle (protected beforeCreate/created/.../destroyed) ///
  /// methods (private/public) ///
  /// render ///
}
</script>

<style lang="scss" module>
.wrapper {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 5% 0;
}
</style>
