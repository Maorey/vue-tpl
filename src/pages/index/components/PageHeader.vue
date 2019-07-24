<!--
 * @Description: 标题
 * @Author: 毛瑞
 * @Date: 2019-07-08 12:44:14
 -->
<template>
  <header :class="$style.wrapper">
    大屏示例
  </header>
</template>

<script lang="ts">
import userState from '@index/store/modules/user'

import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  // 用户名
  // get name() {
  //   return userState.name
  // }
  // ...
}
</script>

<style lang="scss" module>
.wrapper {
  margin-top: 15px;
  color: $colorText;
  font-size: $large;
  text-align: center;
}
</style>
