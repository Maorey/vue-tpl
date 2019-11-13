<!--
 * @Description: 失败提示 比如异步组件加载失败时用
 * @Author: 毛瑞
 * @Date: 2019-07-02 14:34:26
 -->
<template>
  <div :class="$style.wrapper">
    <div @click="$emit('$')">
      <!-- 图标 -->
      <i class="i-frown-fill" />
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
    return MSG.fail
  }
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  box-sizing: border-box;
  height: 100%;
  // height: -webkit-fill-available;
  min-height: 80px;
  text-align: center;

  div {
    align-self: center;
    margin: auto;
    color: $colorTextCommon;
    cursor: pointer;
  }
  // 图标
  i {
    display: inline-block;
    width: 30px;
    padding: 5px;
    font-size: $xxLarge;
    border: $borderBase;
    border-radius: $borderRadiusCircle;
  }
}
</style>
