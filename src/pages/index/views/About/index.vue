<!--
 * @Description: About视图【仅布局】
 * @Author: 毛瑞
 * @Date: 2019-07-25 10:19:56
 -->
<template>
  <div :class="$style.wrapper">
    这里是About视图
  </div>
</template>

<script lang="ts">
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

// const UPPER_CASE:string|number|any[] // 常量
// const camelCase:any // 单例
// function utils() {} // 函数(无副作用)

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
  /// methods (private/public) ///
  /// render ///
}
</script>

<style lang="scss" module>
.wrapper {
  padding: 10% 0;
  margin-top: 30vh;
  color: $colorText;
  text-align: center;
  font-size: $xx-large;
  background: url(~@index/assets/bg-grid.png);
}
</style>
