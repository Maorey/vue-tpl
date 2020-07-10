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
import MSG from '@/config/message'
import STYLE from '@/scss/status.module.scss'

export default {
  props: {
    /** 图标 */
    icon: { type: String, default: 'el-icon-error' },
    /** 图标颜色 */
    type: { type: String, default: 'danger' },
    /** 文字 MSG[msg] || msg */
    msg: { type: String, default: 'fail' },
    /** 重试消息 触发$事件(父组件监听以刷新) */
    retry: { type: null as any, default: 'retry' },
  },
  computed: { MSG: () => MSG, STYLE: () => STYLE },
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
  // 消息
  p,
  a {
    margin: 5px 0;
    font-size: $small;
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
