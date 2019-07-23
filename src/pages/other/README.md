## 关于本页面

本页面使用`element-ui`，并且自定义了其样式，全局注册了部分常用组件，其他组件请局部注册。
局部使用时，为和自定义主题一致，样式请**直接**从`~element-ui/packages/theme-chalk/src`引入对应组件的样式源码,比如:

```html
<template>
  <ElButton>默认按钮</ElButton>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { Button as ElButton } from 'element-ui'
import 'element-ui/packages/theme-chalk/src/button.scss'

@Component({
  components: { ElButton },
})
export default class extends Vue {}
</script>
```
