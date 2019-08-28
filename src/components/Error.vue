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
import { load } from '@/config/message'

@Component
export default class extends Vue {
  get text() {
    return load.fail
  }
}
</script>

<style lang="scss" module>
.wrapper {
  min-height: 70px;
  height: -webkit-fill-available;
}

.error {
  width: 160px;
  height: 70px;
  cursor: pointer;
  color: $colorText;
  text-align: center;

  @extend %centerPage;

  // 图标
  i {
    width: 30px;
    padding: 5px;
    margin-bottom: 5px;
    border-radius: 100%;
    font-size: $xx-large;
    display: inline-block;
    border: 1px solid $colorText;
  }
}
</style>
