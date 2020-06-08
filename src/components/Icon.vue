<!-- 彩色图标 -->
<template>
  <svg
    :class="$style.icon"
    :style="style"
  >
    <use :xlink:href="'#' + icon" />
  </svg>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import '@/scss/font/iconfont.min'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const REG_NUM = /\s*([\d.]+)(\w+)/

/** <Icon icon="i-shibai" size="16px" />
 * emit: (事件名: [参数列表, ...])
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    /** 图标 */
    icon: { type: String, default: '' },
    /** 字体大小 */
    size: { type: String, default: '' },
  },
  computed: {
    style() {
      const size = this.size
      const result = REG_NUM.exec(size)
      if (!result || !result.length) {
        return ''
      }

      return `width:${size};height:${size};vertical-align:-${0.15 * +result[1] +
        result[2]}`
    },
  },
}
</script>

<style lang="scss" module>
.icon {
  width: 1rem;
  height: 1rem;
  overflow: hidden;
  vertical-align: -0.15rem;
  fill: currentColor;
}
</style>
