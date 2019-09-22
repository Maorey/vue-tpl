<!--
 * @Description: 加载动画(svg转圈) 比如异步组件加载时用
 * @Author: 毛瑞
 * @Date: 2019-07-02 14:34:16
 -->
<template>
  <div :class="$style.wrapper">
    <svg
      viewBox="25 25 50 50"
      :class="$style.loading"
    >
      <!-- 背景圈 -->
      <circle
        cx="50"
        cy="50"
        r="20"
      />
      <!-- 前景圈（动画） -->
      <circle
        cx="50"
        cy="50"
        r="20"
      />
    </svg>
    <!-- 文字 -->
    <p>{{ msg }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MSG from '@/config/message'

@Component
export default class extends Vue {
  get msg() {
    return MSG.load
  }
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  height: 100%;
  // height: -webkit-fill-available;
  min-height: 70px;
  text-align: center;
}

.loading {
  align-self: center;
  width: 100px;
  margin: auto;

  circle {
    fill: none;
    stroke-width: 2;

    &:first-child {
      stroke: $colorDark;
    }

    &:last-child {
      animation: dash 2.5s linear infinite;
      stroke: $colorTheme;
      stroke-linecap: round;
    }
  }
}
// 转圈动画
@keyframes dash {
  0% {
    stroke-dasharray: 0, 250%;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 250%, 250%;
    stroke-dashoffset: 0;
  }

  100% {
    stroke-dasharray: 250%, 250%;
    stroke-dashoffset: -250%;
  }
}
</style>
