<!--
 * @Description: 失败提示 比如异步组件加载失败时用
 * @Author: 毛瑞
 * @Date: 2019-07-02 14:34:26
 -->
<template>
  <div :class="$style.wrapper">
    <div
      :class="$style.error"
      @click="$emit('$')"
    >
      <!-- 图标 -->
      <i class="i-frown-fill" />
      <!-- 文字 -->
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import load from '@/config/message'

@Component
export default class extends Vue {
  get text() {
    return load.fail
  }
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  height: 100%;
  // height: -webkit-fill-available;
  min-height: 80px;
  text-align: center;
}

.error {
  align-self: center;
  width: 180px;
  margin: auto;
  color: $colorText;
  cursor: pointer;

  // 图标
  i {
    display: inline-block;
    width: 30px;
    padding: 5px;
    font-size: $xxLarge;
    border: 1px solid $colorText;
    border-radius: 100%;
  }
}
</style>
