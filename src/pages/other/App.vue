<!--
 * @Description: 页面布局
 * @Author: 毛瑞
 * @Date: 2019-08-08 17:48:25
 -->
<template>
  <body :class="$style.wrapper">
    <div :class="$style.nav">
      <RouterLink to="/home">
        Home
      </RouterLink>|
      <RouterLink to="/about">
        About
      </RouterLink>
    </div>
    <Transition
      appear
      name="fade"
      mode="out-in"
    >
      <KeepAlive
        :max="9"
        :exclude="$route.meta.$.e"
      >
        <RouterView />
      </KeepAlive>
    </Transition>

    <ElRow>
      <ElButton>默认按钮</ElButton>
      <ElButton type="primary">
        主要按钮
      </ElButton>
      <ElButton type="success">
        成功按钮
      </ElButton>
      <ElButton type="info">
        信息按钮
      </ElButton>
      <ElButton type="warning">
        警告按钮
      </ElButton>
      <ElButton type="danger">
        危险按钮
      </ElButton>
    </ElRow>

    <ElRow>
      <ElButton plain>
        朴素按钮
      </ElButton>
      <ElButton
        type="primary"
        plain
      >
        主要按钮
      </ElButton>
      <ElButton
        type="success"
        plain
      >
        成功按钮
      </ElButton>
      <ElButton
        type="info"
        plain
      >
        信息按钮
      </ElButton>
      <ElButton
        type="warning"
        plain
      >
        警告按钮
      </ElButton>
      <ElButton
        type="danger"
        plain
      >
        危险按钮
      </ElButton>
    </ElRow>

    <ElRow>
      <ElButton round>
        圆角按钮
      </ElButton>
      <ElButton
        type="primary"
        round
      >
        主要按钮
      </ElButton>
      <ElButton
        type="success"
        round
      >
        成功按钮
      </ElButton>
      <ElButton
        type="info"
        round
      >
        信息按钮
      </ElButton>
      <ElButton
        type="warning"
        round
      >
        警告按钮
      </ElButton>
      <ElButton
        type="danger"
        round
      >
        危险按钮
      </ElButton>
    </ElRow>

    <ElRow>
      <ElButton
        icon="el-icon-search"
        circle
      />
      <ElButton
        type="primary"
        icon="el-icon-edit"
        circle
      />
      <ElButton
        type="success"
        icon="el-icon-check"
        circle
      />
      <ElButton
        type="info"
        icon="el-icon-message"
        circle
      />
      <ElButton
        type="warning"
        icon="el-icon-star-off"
        circle
      />
      <ElButton
        type="danger"
        icon="el-icon-delete"
        circle
      />
    </ElRow>
    <ElRow>
      <ElButton
        type="success"
        icon="el-icon-refresh"
        @click="$router.replace('/r' + $route.fullPath)"
      >
        刷新
      </ElButton>
    </ElRow>
  </body>
</template>

<style lang="scss" module>
.wrapper {
  color: $colorTextCommon;
  text-align: center;
}

.nav {
  padding: 30px;

  a {
    color: $colorTextCommon;
    font-weight: bold;

    &:global(.router-link-exact-active) {
      color: $colorTheme;
    }
  }
}
</style>
