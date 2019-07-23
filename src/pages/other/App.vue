<template>
  <body id="app">
    <div id="nav">
      <RouterLink to="/">
        Home
      </RouterLink>|
      <RouterLink to="/about">
        About
      </RouterLink>
    </div>
    <RouterView />

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
  </body>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

@import '@/scss/reset.scss';
</style>
