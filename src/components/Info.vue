<!--
 * @Description: 提示信息 比如异步组件加载失败时用
 * @Author: 毛瑞
 * @Date: 2019-07-02 14:34:26
 -->
<template>
  <div :class="$style.wrapper">
    <div>
      <!-- 图标 -->
      <i
        v-if="icon"
        :class="[icon, STYLE[type], STYLE['bd' + type]]"
      />
      <!-- 消息 -->
      <p v-if="msg">
        {{ MSG[msg] || msg }}
      </p>
      <!-- 重试 -->
      <a
        v-if="retry"
        @click="$emit('$')"
      >{{ MSG[retry] || retry }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import MSG from '@/config/message'
import STYLE from '@/scss/status.module.scss'

@Component
export default class extends Vue {
  /** 图标 默认 el-icon-error
   */
  @Prop({ default: 'el-icon-error' }) icon!: string
  /** 图标颜色 默认 danger
   */
  @Prop({ default: 'danger' }) type!: string
  /** 文字 MSG[msg] || msg 默认 fail
   */
  @Prop({ default: 'fail' }) msg!: string
  /** 重试消息 触发$事件(父组件监听以刷新)
   */
  @Prop({ default: 'retry' }) retry!: string | Falsy

  private get MSG() {
    return MSG
  }

  private get STYLE() {
    return STYLE
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
  }
  // 图标
  i {
    display: inline-block;
    padding: 10px;
    font-size: $xxxLarge;
    border: $borderBase;
    border-radius: $borderRadiusCircle;
  }
  // 重试
  a {
    display: block;
    color: $colorTheme3;
    cursor: pointer;

    &:hover {
      color: $colorTheme;
    }
  }
}
</style>
