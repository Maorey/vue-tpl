<!--
 * @Description: 页面布局
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 -->
<template>
  <body>
    <form :class="$style.skin">
      <input
        v-for="val in SKIN"
        :key="val"
        name="skin"
        type="radio"
        :value="val"
        :checked="val === skin"
        @click="skin = val"
      >
    </form>
    <Transition
      appear
      name="fade"
      mode="out-in"
    >
      <KeepAlive
        :max="9"
        :exclude="$router.$.e"
      >
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
          <img
            :src="item.src"
            :alt="item.name"
          >
          <h4>{{ item.name }}</h4>
        </routerLink>
      </div>
    </Transition>
  </body>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'

import statePrefer from '@index/store/modules/prefer'

@Component
export default class extends Vue {
  // data()
  private showNav = false

  // computed
  get LINK() {
    const LINK = []

    const ROUTE = (this.$router as any).options.routes as RouteConfig[]
    for (const config of ROUTE) {
      LINK.push({
        to: config.path, // uri
        src: config.meta.thumb, // 缩略图
        name: config.meta.name, // 描述
      })
    }

    return LINK
  }

  get SKIN() {
    return ['light', 'dark']
  }

  get skin() {
    return statePrefer.skin
  }

  set skin(skin: string) {
    statePrefer.SET_SKIN(skin)
  }
}
</script>

<style lang="scss">
/// 全局样式 ///
@import '~@/scss/reset';

html,
body {
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss" module>
.nav {
  position: absolute;
  bottom: 5px;
  box-sizing: border-box;
  width: 100%;
  text-align: center;
  background-color: $colorBackGround;
  border: $borderSolidWidth solid $colorTheme;

  > a {
    display: inline-block;
    margin: 25px;
    color: $colorTextCommon;
    border: $borderSolidWidth solid $colorTransparent;

    &:hover {
      color: $colorTextMain;
      text-decoration: none;
    }

    &:global(.router-link-active) {
      border-color: $colorTheme;
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
    border: solid $colorTheme;
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

.skin {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}
</style>
