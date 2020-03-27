<!--
 * @Description: 加载动画(svg转圈) 比如异步组件加载时用
 * @Author: 毛瑞
 * @Date: 2019-07-02 14:34:16
 -->
<template>
  <div :class="$style.wrapper">
    <div>
      <svg viewBox="25 25 50 50">
        <!-- 背景圈 -->
        <circle
          r="20"
          cx="50"
          cy="50"
        />
        <!-- 前景圈（动画） -->
        <circle
          r="20"
          cx="50"
          cy="50"
        />
      </svg>
      <!-- 文字 -->
      <p>{{ msg }}</p>
    </div>
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
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  // height: -webkit-fill-available;
  min-height: 70px;
  text-align: center;

  div {
    align-self: center;
    margin: auto;
    color: $colorTextCommon;
  }

  svg {
    width: 100px;
    background: url(~@/assets/logo.png) center no-repeat;
    animation: hue 2.5s infinite;
  }

  circle {
    fill: none;
    stroke-width: 2;

    &:first-child {
      stroke: $colorTheme6;
    }

    &:last-child {
      animation: dash 2.5s infinite;
      stroke: $colorTheme;
      stroke-linecap: round;
    }
  }
}
// 渐变
@keyframes hue {
  0% {
    filter: hue-rotate(0);
  }

  100% {
    filter: hue-rotate(360deg);
  }
}

// 转圈
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
