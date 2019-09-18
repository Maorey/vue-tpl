<!--
 * @Description: 页面布局
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 -->
<template>
  <body>
    <Transition
      appear
      name="fade"
    >
      <KeepAlive>
        <RouterView />
      </KeepAlive>
    </Transition>
    <!-- 导航 -->
    <div :class="$style.array">
      <i @mouseenter="showNav = true" />
    </div>
    <Transition
      appear
      name="flip"
    >
      <div
        v-show="showNav"
        :class="$style.nav"
        @mouseleave="showNav = false"
      >
        <routerLink
          v-for="item in LINK"
          :key="item.name"
          :to="item.to"
        >
          <img :src="item.src">
          <h4>{{ item.name }}</h4>
        </routerLink>
      </div>
    </Transition>
  </body>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { IObject } from '@/types'
import CONFIG from './config/route'
const ROUTE = CONFIG as IObject<IObject>

// 选项顺序: https://cn.vuejs.org/v2/style-guide/#组件-实例的选项的顺序-推荐
@Component
export default class extends Vue {
  // data()
  private showNav: boolean = false

  // computed
  get LINK() {
    const LINK: IObject[] = []
    let key
    let temp: IObject
    for (key in ROUTE) {
      temp = ROUTE[key]
      LINK.push({
        name: temp.title,
        to: `/${temp.name}`,
        src: require(`@index/assets/${temp.name}.png`),
      })
    }
    return LINK
  }
}
</script>

<style lang="scss" module>
.nav {
  position: absolute;
  bottom: 5px;
  box-sizing: border-box;
  width: 100%;
  text-align: center;
  background-color: $colorBackGround;
  border: 1px solid $colorHighlight;

  > a {
    display: inline-block;
    margin: 25px;
    color: $colorLightGrey;
    border: 1px solid #0000;

    &:hover {
      color: $colorText;
      text-decoration: none;
    }

    &:global(.router-link-active) {
      border-color: $colorHighlight;
    }

    > img {
      height: 150px;
    }
  }
}

.array {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;

  > i {
    display: inline-block;
    padding: 6px;
    border: solid $colorHighlight;
    border-width: 0 2px 2px 0;
    animation: float 1s infinite ease-out;

    @keyframes float {
      0% {
        transform: rotate(-135deg) translate3d(-5px, -5px, 0);
      }

      100% {
        transform: rotate(-135deg) translate3d(5px, 5px, 0);
      }
    }
  }
}
</style>

<style lang="scss">
/// 全局样式 ///
@import '~@/scss/reset';
@import '~@/scss/icons';
@import '~@/scss/transitions';

html,
body {
  height: 100%;
  overflow: hidden;
}
</style>
