# vue-tpl

vue + vuex + vue router + TypeScript(支持 JavaScript) 模板

[更新日志](CHANGELOG.md)

- [环境要求](#环境要求)
  - [建议开发环境](#建议开发环境)
- [浏览器支持](#浏览器支持)
- [命令参考](#命令参考)
  - [安装项目](#安装项目)
    - [可选项](#可选项)
  - [开发环境](#开发环境开发调试时使用)
  - [构建项目](#构建项目生成部署文件)
  - [代码风格检查和修正](#代码风格检查和修正提交-git-时会自动执行)
  - [e2e测试](#e2eend-to-end-测试)
  - [单元测试](#单元测试)
  - [命令帮助](#命令帮助)
- [说明及注意事项](#说明及注意事项)
  - [目录结构](#目录结构)
  - [风格建议](#风格建议)
  - [其他建议](#其他建议)
  - [优化](#优化)
    - [web 页面](#web%20页面)
    - [工程](#工程)
- [部署](<#部署(nginx)>)
- [备忘](#备忘)
  - [文档](#文档)
    - [数据可视化](#数据可视化)
  - [笔记](#笔记)
  - [问题及思考](#问题及思考)
  - [其他](#其他)

## 环境要求

- `Node.js`: 建议 v12.13.1
- `yarn`: 建议 v1.21.1

### 建议开发环境

- `Git`: 最新 代码管理
- `Visual Studio Code` (VSCode): 最新 IDE

VSCode 插件

- `Vetur`: 最新 vue 开发必备
- `GitLens`: 最新 Git 可视化工具
- `ESLint`: 最新 脚本代码检查
- `stylelint`: 最新 样式代码检查
- `Prettier - Code formatter`: 最新 代码格式化

浏览器插件

- `Vue Devtools`: 最新

> 推荐工具: [`@vue/cli`](https://cli.vuejs.org/zh/guide), 全局安装时可使用 `vue ui` 命令启动图形化界面管理项目

> 推荐字体: [FiraCode](https://github.com/tonsky/FiraCode)

## 浏览器支持

支持现代浏览器及 IE10+

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## 命令参考

### 安装项目

```bash
yarn # 安装依赖
git config core.ignorecase false # 使git对文件名大小写敏感
```

### 开发环境(开发调试时使用)

```bash
yarn dev # --port 9876 : 本次启动使用9876端口 (可以在 .env.development.local 文件中设置)
yarn dev --mode=production # 调试皮肤切换
```

### 构建项目(生成部署文件)

```bash
yarn build # --watch: 跟踪文件变化 --report: 生成打包分析
```

同时会生成文件名/chunk名[映射文件](build/~fileName) (公共代码抽到`_`开头的文件里了)

### 代码风格检查和修正(提交 Git 时会自动执行)

```bash
yarn lint
```

### e2e(end-to-end) 测试

```bash
yarn test:e2e
```

### 单元测试

```bash
yarn test:unit # --watch : 跟踪文件变化
```

### 命令帮助

```bash
yarn vue-cli-service help # [命令] : 比如 yarn vue-cli-service help test:e2e
```

## 说明及注意事项

### 目录结构

```bash
├── public # 静态文件目录, 除特殊文件(比如 html 模板)外, 直接复制到输出目录下
├── src # 源码目录
│   │── api # http通信
│   │── assets # 静态资源文件目录, 使用到的会被解析处理(比如图片可能转成base64写入css/js或复制到输出目录)
│   │── components # 组件目录
│   │── config # 配置目录
│   │── lang # 多语言目录
│   │── libs # 存储不(能)通过 npm 管理的第三方或项目 js/css 库
│   │── scss # (.module).scss 文件
│   │── router # 路由设置
│   │── store # 状态管理
│   │   └── modules # 各模块状态管理
│   │── types # ts 接口/申明文件
│   │── utils # 工具集(一般为幂等函数/单例对象/Class)
│   │── views # 视图
│   │── pages # 【可选】多页时页面的存储目录
│   │── html模板名 # 【可选】存放页面代码目录
│   └── (html模板名/main/index/entry/app/page).(ts|tsx|js|jsx) # 默认入口文件
├── tests # 测试用例目录
│   │── e2e # e2e 测试(cypress): https://www.cypress.io
│   └── unit # unit 测试(jest): https://jestjs.io
├── build # 项目工具类脚本
├── cypress.json # cypress 配置: https://docs.cypress.io/guides/references/configuration.html
├── tsconfig.json # typeScript 配置: https://www.tslang.cn/docs/handbook/tsconfig-json.html
└── vue.config.js # 工程(vue cli)配置入口
```

> 目录结构说明:

1. 只支持对 `public` 目录下的 html 模板(不包括子文件夹下的)自动设置入口, 规则为:

   1. 遍历 public 下的 html 模板文件, 得到一个 html 模板
   2. 依次对 src 目录及 src/pages 进行如下查找:
      1. 若该目录下存在与该 html 模板名同名的 ts/tsx/js/jsx 文件则设置为入口, 未找到或已占用则**↓**
      2. 依次检查下列文件名: main/index/entry/app/page 设置为入口, 未找到或已占用则**↓**
      3. 在该目录下与 html 模板同名的目录下按照**上述**规则继续查找, 最终仍未找到或已占用则不设置入口

   建议: **单页入口直接放 src 目录下, 多页时入口分别放在 pages 目录下与 html 模板同名的文件夹下**

2. <a id="别名"></a>已有目录别名如下:

   - `@` -> `src`
   - `@com` -> `src/components`
   - `@{entry}` -> 页面入口文件所在目录, 如: `@index`
   - `@{entry}Com` -> 页面入口文件所在目录下的 `components` 目录, 如: `@indexCom`

   **Tips**: 在 `scss` 中使用 `~` 解析 `别名`/`依赖包` 对应目录. 示例:

   ```html
   <!-- SomeView.vue -->
   <template>
     <div :class="$style.wrapper">
       <!-- 视为ts/js -->
       <img src="@/assets/logo.png" />
     </div>
   </template>

   <style lang="scss">
    /* => node_modules/normalize.css/normalize.css */
    @import '~normalize.css';
   </style>

   <style lang="scss" module>
    .wrapper {
      background: url(~@index/assets/bg.png);
    }
   </style>
   ```

3. 输出目录为 `dist`, 包含 js/css/img/font/media 等文件夹
4. `config` 目录下的所有内容都会被内联到对应`html`中(需要保留的注释请使用: `/*! 注释内容 */`), 用于支持直接修改配置而不必重新打包代码
5. 测试用例目录层级与文件名应尽量与源码对应

> **提示和建议**

- 新建目录时尽量复用上述列出的目录名, 保证结构清晰的情况下减少目录层级
- 目录及文件命名:

  **文件夹及其它文件**(js/scss/图片等)使用 `camelCase` (即: 首字母小写驼峰 = lowerCamelCase)

  **vue 单文件组件**(含[tsx](https://github.com/wonderful-panda/vue-tsx-support)/`jsx`/`functional.(ts|js)`)使用 `PascalCase` ( 即: 首字母大写驼峰 = CamelCase = UpperCamelCase)

  例外情况(方便重构):

  - 组件包含不可复用的子组件时, 应视为一个组件, 创建**文件夹容器**, 比如:

    ```TypeScript
    // BillList组件
    BillList
    │── index.(vue|tsx|ts|jsx|js) # 可以例外
    │── Item.vue
    └── ...

    // 使用组件
    import BillList from '{path}/BillList'
    ```

- 除了以下样式可以使用全局:

  - 浏览器默认样式重置
  - `Transition` 动画样式
  - 字体图标样式
  - 公共组件样式([BEM](https://en.bem.info)约定[参考链接](https://www.ibm.com/developerworks/cn/web/1512_chengfu_bem/))

  均应使用 [CSSModule](https://vue-loader-v14.vuejs.org/zh-cn/features/css-modules.html)(开发环境class名:`[folder]__[name]_[local]-[emoji]$`), 以更好的模块化和复用、打包样式

- 视图只负责布局及交互(props 传递和事件监听), 包含子组件的可使用**文件夹容器**方式或将子组件存放在对应层级的 `components` 目录下的同名目录(`camelCase`)下
- 公共组件/逻辑/函数/样式等模块请按照: `模块 -> 视图 -> 页面 -> 项目` 的层级提升, 配合**提前规划**确定初始层级
- 越高的层级测试覆盖率也应越高; 被测试的代码应加注释`@test: true`表示在对应目录下包含测试用例,否则指明路径; 修改了测试覆盖的代码后, 应视情况增加测试内容并运行测试, 以保证功能和行为与之前一致
- 尽量**不要使用全局注册**(插件/组件/指令/混入等)以优化打包和使代码更清晰、易维护
- 组件尽量**按逻辑和呈现拆分**以更好的复用和维护
- 尽量**按照依赖库的文档描述**来使用她, 从其源码(src)引入模块(css/scss/.../js/mjs/ts/jsx/tsx/vue), 将可能**不会被转译**且更可能随版本更新改变, 需要时可以从其构建后的 lib/dist 等目录引入或者增加一些配置(需要了解模块解析及转码规则和相关插件, 不推荐)

### 风格建议

> 推荐使用 [TypeScript](https://www.tslang.cn)

- JavaScript/TypeScript 代码风格为 [**JavaScript standard**](https://standardjs.com/rules-zhcn.html), 主要有以下区别:

  - 使用单引号
  - 不要句尾分号
  - 多行末尾保留逗号
  - 方法名后不要空格

  (.vscode 文件夹为 VSCode 的工作区设置, 只在本项目生效, 已包含相关设置)

- 另请参考: [vue 风格指南](https://cn.vuejs.org/v2/style-guide/) **推荐(C)及以上** 和 [stylelint](https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md) [配置](.stylelintrc.js)
- 引用 `vue/tsx/ts/js/jsx` **不要加文件扩展名**, 有利于重构代码
- 在`tsx/jsx`中使用全局注册的组件时可以使用`kebab-case`, 否则会在控制台输出错误 ┐(: ´ ゞ｀)┌

  ```TypeScript
  import { CreateElement } from 'vue'
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class extends Vue {
    private render(h: CreateElement) {

      return (
        <el-row>
          <el-button>这是个按钮</el-button>
        </el-row>
      )
    }
  }
  ```

- `enum/type/interface` 需要导出的直接 `export` (否则可能会得到 undefined), 其他的除了字典(硬编码)外, 先定义再`export`(IDE 提示更友好), 并且`export`语句放到最后
- 不要使用 `$` 作为组件事件名, 该名字已被[异步组件刷新](src/utils/highOrder.ts)占用
- 为避免 [Vue属性名](https://cn.vuejs.org/v2/style-guide/#私有属性名-必要) 冲突, 私有属性请使用 `$_` 作为一般命名空间(在保证易维护的前提下可以使用单字母, 但尽量避免), `_$` 作为`全局/跨组件/hack`命名空间
- 路由请**全部**使用异步组件(`@utils/highOrder getAsync`), 以使路由及其**子(异步)组件**可以局部刷新
- CSS Modules class 名使用 `camelCase`, 选择器嵌套**不应超过三层**
- <a id="全局scss"></a>**全局 sccs** _(包含<a href="#别名">各别名</a>下[.env](.env) `GLOBAL_SCSS`变量指定的文件)_ 中不要出现具体样式, 也不要有[`:export{}`](https://github.com/css-modules/icss#export)(应在 `scss/export` 目录下或 `export*.scss` 中使用); 为保证`ts/js`中引入时 scss 变量注入正确(使用缓存会导致无法对相同文件多次注入变量，不用缓存显然不合理), 应在合适的 scss 文件中引入目标样式源码:

  ```scss
  // el.scss
  @import '~element-ui/packages/theme-chalk/src/button';
  ```

  ```html
  <template>
    <ElButton>默认按钮</ElButton>
  </template>

  <script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'

    // 没有打包ESM, 不支持 tree-shaking ┐(: ´ ゞ｀)┌
    // import { ElButton } from 'element-ui'
    import ElButton from 'element-ui/lib/button'
    import './el.scss'

    @Component({
      components: { ElButton },
    })
    export default class extends Vue {}
  </script>
  <!-- 也可以在这儿引用
  <style lang="scss">
  @import '~element-ui/packages/theme-chalk/src/button';
  </style> -->
  ```

  或

  ```TypeScript
  import { CreateElement } from 'vue'
  import { Component, Vue } from 'vue-property-decorator'

  import ElButton from 'element-ui/lib/button'
  import './el.scss'

  @Component
  export default class extends Vue {
    private render(h: CreateElement) {
      return <ElButton>默认按钮</ElButton>
    }
  }
  ```

- **不要用全局样式覆盖全局样式**, 应使用 `CSSModule` 并使[优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)相等(注意顺序, 包括同步/异步)或更高:

  ```scss
  // 以下默认local

  // bad →_→
  :global(.content .title.active) {
    color: $colorHighlight;
  }
  // good ｂ(￣▽￣)ｄ
  .content :global(.title.active) {
    color: $colorHighlight;
  }
  // good ｂ(￣▽￣)ｄ
  .content .title {
    &:global(.active) {
      color: $colorHighlight;
    }
  }
  ```

- 尽量使用项目代码模板, 现有模板有(VSCode 输入左侧字符, [其他 IDE](.vscode/vue.code-snippets)):
  - `ts`: `.vue` 文件中使用, `TypeScript`
  - `vue`: `.tsx` 文件中使用, `TypeScript`
  - `vuex`: `.ts` 文件中使用, `vuex module` class语法
  - `js`: `.vue` 文件中使用, `JavaScript`
  - `vue`: `.jsx` 文件中使用, `JavaScript`
  - `vuex`: `.js` 文件中使用, `vuex module` class语法
- **Git 提交信息规范**参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `Feat` 增加新功能
  - `Fix` 修复问题/BUG
  - `Style` 代码风格相关无影响运行结果的
  - `Perf` 优化/性能提升
  - `Refactor` 重构
  - `Polish` 润色
  - `Revert` 撤销修改
  - `Test` 测试相关
  - `Docs` 文档/注释
  - `Chore` 依赖更新/脚手架配置修改等
  - `Workflow` 工作流改进
  - `Ci` 持续集成
  - `Mod` 不确定分类的修改

### 其他

- 关于换肤方案, 本模板采用的是 `<link rel="alternate stylesheet">`[方案](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets), 基于`scss`全局变量注入进行多个皮肤的构建, 优点是支持异步, 浏览器原生支持并且无缝流畅切换. 通过环境变量[.env](.env)进行配置, 在`import` **scss** 文件时可以指定皮肤和使用的 scss 变量(指定后不生成其他皮肤的)

  ```html
  <script lang="ts">
    /// 基础样式 ///
    import './scss/a.scss?skin='
    // 指定scss变量文件相对路径(别名/皮肤文件夹)
    import './scss/b.scss?skin=|foo.scss'

    /// 皮肤样式 ///
    import './scss/c.scss'
    import $styleD from './scss/d.module.scss'

    /// 指定各皮肤下的样式 ///
    import './scss/e.scss?skin=dark'
    import './scss/f.scss?skin=light'

    // CSS Module
    import getSkin from '@/utils/skin'
    import styleDark from './scss/g.module.scss?skin=dark|foo.scss'
    import styleLight from './scss/g.module.scss?skin=light|bar.scss'

    // see: https://github.com/kaorun343/vue-property-decorator
    import { Component, Vue } from 'vue-property-decorator'

    // const UPPER_CASE:string|number|any[] // 常量
    const $styleF = getSkin({ dark: styleDark, light: styleLight })
    // const camelCase:any // 单例
    // function utils() {} // 函数(无副作用)

    /// name,components,directives,filters,extends,mixins ///
    @Component
    export default class extends Vue {
      /// model (@Model) ///
      /// props (@Prop) ///
      /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
      /// private instance attributes (private name?: string // 非响应式属性) ///
      /// computed (get name() { return this.name } set name()... ///
      private get $styleD() {
        return $styleD
      }

      private get $styleF() {
        return $styleF
      }
      /// watch (@Watch) ///
      /// LifeCycle (private beforeCreate/created/.../destroyed) ///
      /// methods (private/public) ///
      /// render ///
    }
  </script>

  <!-- 皮肤样式 CSS Module or not -->
  <style lang="scss" module>
  .foo {
    color: $red;
  }
  </style>
  <!-- 基础样式 -->
  <style lang="scss" module skin="skin=|foo.scss">
  .bar {
    color: $red;
  }
  </style>
  <!-- 指定各皮肤下的样式【不支持CSS Module】 -->
  <style lang="scss" skin="dark">
  .foo {
    color: $red;
  }
  </style>
  <style lang="scss" skin="light">
  .foo {
    color: $red;
  }
  </style>
  ```

- 正确规范([JSDoc](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc))简洁适当的各种**注释**, 比如函数注释及必要的变量注释:

  ```TypeScript
  /** 二维点
   */
  interface IPoint {
    x: number
    y: number
    /** 描述
     */
    desc?: string
  }
  /** 角度转弧度常量
   */
  const ANGLE_RADIAN = Math.PI / 180
  /** 计算圆上的点
   *
   * @param {IPoint} center 圆心
   * @param {Number} radius 半径
   * @param {Number} angle 角度
   *
   * @returns {IPoint} 圆上的点坐标
   */
  function getPointOnCircle(center: IPoint, radius: number, angle: number): IPoint {
    const redian = angle * ANGLE_RADIAN // 弧度

    return {
      x: center.x + radius * Math.sin(redian),
      y: center.y - radius * Math.cos(redian),
    }
  }

  export { getPointOnCircle }
  ```

  分支注释:

  ```TypeScript
  // if return 或 pipeline ｂ(￣▽￣)ｄ
  if(...) {
    // 说明
  } else if(...) {
    // 说明
    if(...) {
      // 说明
    } else {
      // 说明
    }
  } else {
    // 说明
  }

  // 使用枚举或字典时可不写注释
  switch(expression) {
    case value1:
      // 说明
      ...
      break
    case value2:
      // 说明
      ...
      break
    default:
      ...
  }
  ```

- [异步 chunk](https://webpack.docschina.org/api/module-methods) 使用入口层级命名(方便排查问题和碎文件合并), 比如: index 页面下的 home 视图命名为 `index_home`, 其下的用户视图命名为 `index_home_my`, 用户基础信息命名为 `index_home_my_baseinfo` . 为避免文件名太长, 每个层级可以缩写: `iHome`, `ihMy`, `ihmBaseInfo`
- libs 下的库文件需要按需加载的, 应提供引入方法(只会成功加载一次), 比如:

  ```TypeScript
  // src/libs/somelib/index.ts
  /** 模块化异步引入somelib及其插件(全局类似)
  * @param {Array<String>} plugins 需要加载的somelib插件名列表:
  *
  *   plugin1: 插件1
  *
  *   plugin2: 插件2
  *
  *   ...
  *
  * @returns {Promise<Array<Module>>} 模块
  */
  function get(plugins: string[] = []): Promise<any> {
    let somelib: any
    return import(/* webpackChunkName: "lSomelib" */ 'somelib')
      .then((module: any) => {
        somelib = module.default
        return Promise.all(plugins.map((plugin: string) => {
          switch (plugin) {
            case 'plugin1':
              return import(/* webpackChunkName: "lsPlugins" */ 'somelib.plugin1')
            case 'plugin2':
              return import(/* webpackChunkName: "lsPlugins" */ 'somelib.plugin2')
            // 上面两个插件合并到一个chunk里
            // ...
          }
        }) as Array<Promise<any>>)
      })
      // 注册插件(略), 返回somelib
      .then((modules: Array<Promise<any>>) => somelib)
  }

  export default get

  // src/pages/index/components/Foo.vue
  // ...
  // <script lang="ts"> ...
  import get from '@/libs/somelib'

  @Component
  export default class extends Vue {
    /// methods (private/public) ///
    private refreshPanel() {
      get(['plugin2']).then((somelib: any) => somelib.init(this.$refs.panel))
    }
  }
  // ...
  ```

### 配置 & 优化

#### web 页面

请参照 [vue.config.js](vue.config.js) 文件中 _chainWebpack_ 的注释进行配置

- 减小图片大小(比如背景图片等)
- 对多个 js chunk 共同依赖的模块进行缓存/单独提取(cacheGroups)
- 视情况对 css 文件进行合并(比如按入口等, 不设置则按 chunk)【webpack 5 支持设置 css chunk 的 minSize/maxSize 啦】
- [现代模式](https://cli.vuejs.org/zh/guide/browser-compatibility.html#现代模式)

#### 工程

- 需要在 `yarn.lock` (或 `package-lock.json` ) 中, 指定**所有** `mini-css-extract-plugin` 的版本为 `package.json` 对应版本
- 相同chunk下的基础样式(非皮肤样式)文件合并(比如css和scss)

## 部署(nginx)

- chunk hash 长度： 修改 [webpack.optimize.SplitChunksPlugin](node_modules/webpack/lib/optimize/SplitChunksPlugin.js)

  ```JavaScript
  /* 23 */ const hashFilename = name => {
  /* 24 */   return crypto
  /* 25 */       .createHash("md4")
  /* 26 */       .update(name)
  /* 27 */       .digest("hex")
  /* 28 */       .slice(0, 5); // 默认8无法配置
  /* 29 */ };
  ```

- url 重写兼容旧版
- 反向代理, 绕过同源策略限制(api/图片等资源跨域等)
- 开启 `gzip` 压缩, 并重用已有 `gz` 文件 `gzip_static on;`
- 缓存静态资源(html 可减少缓存时间)

配置示例(`xxx` 换成对应值):

```bash
http {
  #underscores_in_headers on; # 允许带下划线的请求头
  # 开启gZip(图片除外)
  gzip on;
  gzip_vary on;
  gzip_static on;
  gzip_proxied any;
  gzip_comp_level 3;
  gzip_min_length 3k;
  gzip_buffers 32 16k;
  gzip_types application/xml application/json application/ld+json application/rss+xml application/atom+xml application/xhtml+xml application/font-woff application/x-font-ttf application/x-javascript application/javascript application/x-httpd-php application/x-font-woff application/vnd.geo+json application/octet-stream application/manifest+json application/vnd.ms-fontobject application/x-web-app-manifest+json font/opentype text/vtt text/css text/plain text/vcard text/javascript text/x-component text/cache-manifest text/vnd.rim.location.xloc text/x-cross-domain-policy image/svg+xml;

  # http跳转到https
  server {
    #server_name  xxx;
    listen       80;
    listen       [::]:80;

    return 301 https://$host$request_uri; # 得用 $host,不造为啥 $server_name 不行
  }
  # https + http2
  server {
    #server_name  xxx;
    listen       443 ssl http2;
    listen       [::]:443 ssl http2;

    ssl_certificate      xxx.crt; # 证书
    ssl_certificate_key  xxx.key; # 私匙
    ssl_session_cache    shared:SSL:5m; # 共享会话缓存大小
    ssl_session_timeout  15m; # 会话超时时间
    #ssl_protocols        TLSv1 TLSv1.1 TLSv1.2;
    #ssl_ciphers          HIGH:!aNULL:!MD5; # 定义算法
    #ssl_prefer_server_ciphers  on; # 优先采取服务器算法

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always; # HSTS策略
    add_header X-Frame-Options DENY; # 减少点击劫持
    add_header X-Content-Type-Options nosniff; # 禁止服务器自动解析资源类型
    add_header X-Xss-Protection 1; # 防XSS攻擊

    location / {
      #rewrite ^/(?:path|path-alias)/(.*)$ /$1 last; # 兼容某些路由
      # 设置静态资源缓存(文件名带内容哈希)
      if ($uri ~ .*\.(?:js|css|jpg|jpeg|gif|png|ico|gz|svg|svgz|ttf|eot|mp4)$) {
        expires 7d; # 7天
      }
      # html(文件名不变)
      if ($uri ~ .*\.(?:htm|html)$) {
        expires 25m; # 25分钟
        #add_header Cache-Control private,no-store,no-cache,must-revalidate,proxy-revalidate;
      }

      index index.html;
      alias xxx/;
      try_files $uri $uri.html $uri/ /;
    }
    location /api {
      proxy_pass https?://xxx:xxx/xxx;
      # 缓存策略...
    }

  }
}
```

## 备忘

### 文档

- [scss](https://www.sass.hk/docs)
- [vue](https://cn.vuejs.org)
- [vuex](https://vuex.vuejs.org)
- [vue-router](https://router.vuejs.org)
- [vuex-class](https://github.com/ktsn/vuex-class)
- [vue-class-component](https://github.com/vuejs/vue-class-component)
- [vuex-module-decorators](https://championswimmer.in/vuex-module-decorators/)
- [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)
- [vue-i18n](http://kazupon.github.io/vue-i18n)
- [element-ui](https://element.eleme.cn)
- [axios](https://github.com/axios/axios)
- [crypto-js](http://cryptojs.altervista.org)
- [jsencrypt](http://travistidwell.com/jsencrypt)

#### 图形库

2D

- [ECharts](https://echarts.baidu.com/api.html#echarts)
- [zrender](https://ecomfe.github.io/zrender-doc/public/api.html)
- [d3](https://github.com/d3/d3/wiki)
- [zdog](https://zzz.dog)
- [pixi.js](https://www.pixijs.com) _(WebGL2/WebGL)_

3D

- [three.js](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene) _(WebGL2/WebGL)_
- [luma.gl](https://luma.gl/#/documentation/api-reference/api-overview/api-structure) _(WebGL2/WebGL)_

### 笔记

- 在 `ts/js` 中使用 `assets` 目录下的图片可以通过 `require('@/assets/img/*.png')`(或 import), 将得到输出路径或 base64 字符串, 其他类似(新的文件格式请配置 loader 和增加[ts 定义](src/shims-modules.d.ts))
- 在 `scss` 中引入 `css` ([@import](https://www.sass.hk/docs)) 有两种方式
  1. 【推荐】不带文件后缀, css 文件内容会被合并到当前文件. 比如: `@import '~normalize.css';`
  1. 带文件后缀, 会处理成 css 的[@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import). 比如: `@import '~normalize.css/normalize.css';`
- Element UI 的 Form 组件 hack 上了 `setIni` 方法, 用于重设表单的初始值以更好地支持重置表单

### 问题及思考

- Vue 异步组件加载失败重试: 最好还是 Vue 对异步组件提供支持[#9788](https://github.com/vuejs/vue/issues/9788)
- 现代模式(只针对 js 文件): 该模式优点是若浏览器支持 ES2015 则加载 ES2015 代码(体积更小执行更快, `<script type="module">` & `<link rel="modulepreload">`)；不支持则加载 Babel 转码后的代码(`<script nomodule>` & `<link rel="preload">`). 但是不知何故未能生效, github 上有一些相关 issue
- [#714](https://github.com/webpack-contrib/sass-loader/issues/714): 【不再考虑支持】可追踪引用, 使在 js 中引用 scss 时可正确<a href="#全局scss">注入 scss 变量</a>
- scss 模块化: 已出 beta 但生态不完善, [草案](https://github.com/sass/sass/blob/master/accepted/module-system.md)
- [微前端化](https://github.com/phodal/microfrontends#复合型): 应考虑基于 [Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components) ([vue 友好](https://cli.vuejs.org/zh/guide/build-targets.html#web-components-组件), 可以兼容其他) 的集成和通信.
- `tsx` 类型支持(去掉`as any`, 利于重构)
- 是否只下载当前皮肤(应无必要, 又不影响性能, 未验证移动端换肤方案是否可行)

### 其他

- 期待 [vue3.0](https://github.com/vuejs/vue/projects/6) & [webpack 5.0](https://github.com/webpack/webpack/projects/5) [正式版](https://github.com/webpack/changelog-v5/blob/master/README.md)
