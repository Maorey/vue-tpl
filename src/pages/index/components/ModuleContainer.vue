<!--
 * @Description: 模块容器
 * @Author: 毛瑞
 * @Date: 2019-07-08 12:03:15
 -->
<template>
  <div :class="$style.wrapper">
    <!-- 模块标题 -->
    <div :class="$style.title">
      <!-- 标题前图标 -->
      <slot name="icon" />
      <!-- 标题文字 -->
      <span :class="$style.text">
        <slot name="title" />
      </span>
      <!-- 标题后单位 -->
      <slot name="unit" />
      <!-- 图形 -->
      <span :class="$style.graph">
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    </div>
    <!-- 四个角 -->
    <span :class="[$style.border, $style.leftTop]" />
    <span :class="[$style.border, $style.rightTop]" />
    <span :class="[$style.border, $style.leftBottom]" />
    <span :class="[$style.border, $style.rightBottom]" />
    <!-- 模块内容 -->
    <slot />
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
  position: relative;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid $colorHighlight;
}
// 标题
.title {
  color: $colorText;

  @extend %ellipsis;
}

.text {
  margin: 0 10px;
  font-weight: bold;
  font-size: $larger;
}
// 图形
.graph {
  margin-left: 10px;

  > span {
    width: 7px;
    height: 10px;
    margin-left: 4px;
    display: inline-block;
    transform: skew(30deg);
    background: $colorHighlight;
  }
}
// 四个角
.border {
  $radius: 3px; // 圆角
  $offset: -1px; // 偏移
  $lineWidth: 2px; // 线宽

  width: 10px;
  height: 10px;
  display: block;
  position: absolute;
  border: solid $colorText;

  &.leftTop {
    top: $offset;
    left: $offset;
    border-top-left-radius: $radius;
    border-width: $lineWidth 0 0 $lineWidth;
  }

  &.rightTop {
    top: $offset;
    right: $offset;
    border-top-right-radius: $radius;
    border-width: $lineWidth $lineWidth 0 0;
  }

  &.leftBottom {
    left: $offset;
    bottom: $offset;
    border-bottom-left-radius: $radius;
    border-width: 0 0 $lineWidth $lineWidth;
  }

  &.rightBottom {
    right: $offset;
    bottom: $offset;
    border-bottom-right-radius: $radius;
    border-width: 0 $lineWidth $lineWidth 0;
  }
}
</style>
