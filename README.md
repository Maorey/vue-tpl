# vue-tpl

vue + vuex + vue router + TypeScript(支持 JavaScript) 模板

[更新日志](CHANGELOG.md)

- [环境要求](#环境要求)
  - [建议开发环境](#建议开发环境)
- [浏览器支持](#浏览器支持)
- [安装](#安装)
- [命令参考(Terminal)](#命令参考Terminal)
  - [启动开发环境](#启动开发环境)
  - [代码风格检查和修正](#代码风格检查和修正提交-git-时会自动执行)
  - [单元测试](#单元测试)
  - [e2e测试](#e2eend-to-end-测试)
  - [生成](#生成部署包)
  - [其他命令](#其他命令)
    - [指定入口](#指定入口SPA-逗号分隔)
    - [指定路由配置](#指定路由配置通过别名)
    - [命令帮助](#命令帮助)
    - [联调](#联调)
- [说明及注意事项](#说明及注意事项)
  - [目录结构](#目录结构)
  - [风格建议](#风格建议)
  - [其他建议](#其他建议)
  - [配置和优化](#配置和优化)
    - [优化](优化)
- [部署](<#部署(nginx)>)
- [备忘](#备忘)
  - [文档](#文档)
    - [数据可视化](#数据可视化)
  - [笔记](#笔记)
  - [问题及思考](#问题及思考)
  - [其他](#其他)

## 环境要求

- `Node.js`: >= v12
- `yarn`: 最新

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

> 推荐工具: [`@vue/cli`](https://cli.vuejs.org/zh/guide)(最新), 全局安装时可使用 `vue ui` 命令启动图形化界面管理工程

> 推荐开发字体: [FiraCode](https://github.com/tonsky/FiraCode)

## 浏览器支持

支持现代浏览器及 IE10+

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## 安装

```bash
git config core.ignorecase false # 使git对文件名大小写敏感
# 或者修改 .git/config [core] ignorecase=false
```

有 `.lock` 文件时**只需**执行 `yarn` (或`npm i`) 安装即可, 否则如下:

1. `yarn` (安装慢可以使用淘宝镜像 `yarn config set registry 'https://registry.npm.taobao.org'`)
2. 修改 `yarn.lock` ( `package-lock.json` 类似) 文件:

  ```diff
  - mini-css-extract-plugin@^0.9.0:
  -   version "0.9.0"
  -   resolved "https://registry.npm.taobao.org/mini-css-extract-plugin/download/mini-css-extract-plugin-0.9.0.tgz?cache=0&other_urls=https%3A%2F%2Fregistry.npm.taobao.org%2Fmini-css-extract-plugin%2Fdownload%2Fmini-css-extract-plugin-0.9.0.tgz#47f2cf07aa165ab35733b1fc97d4c46c0564339e"
  -   integrity sha1-R/LPB6oWWrNXM7H8l9TEbAVkM54=
  -   dependencies:
  -     loader-utils "^1.1.0"
  -     normalize-url "1.9.1"
  -     schema-utils "^1.0.0"
  -     webpack-sources "^1.1.0"

  - alternate-css-extract-plugin@^0.9.0:
  + mini-css-extract-plugin@^0.9.0, alternate-css-extract-plugin@^0.9.0:
      resolved "https://registry.npm.taobao.org/alternate-css-extract-plugin/download/alternate-css-extract-plugin-0.9.0.tgz#6f431f75f94b1cef17bbc83b000c90e30353ddae"
      integrity sha1-b0MfdflLHO8Xu8g7AAyQ4wNT3a4=
      dependencies:
        loader-utils "^1.1.0"
        normalize-url "1.9.1"
        schema-utils "^1.0.0"
        webpack-sources "^1.1.0"
  ```

  即: 将 `mini-css-extract-plugin` 插件替换为 `alternate-css-extract-plugin` 插件

3. `yarn` 再次安装

## 命令参考(Terminal)

### 启动开发环境

```bash
yarn dev # --port 9876 : 本次启动使用9876端口 (可以在 .env.development.local 文件中设置)
```

### 代码风格检查和修正(提交 Git 时会自动执行)

```bash
yarn lint
```

### 单元测试

```bash
yarn test:unit # --watch : 跟踪文件变化
```

### e2e(end-to-end) 测试

```bash
yarn test:e2e
```

### 生成(部署包)

```bash
yarn build # --watch: 跟踪文件变化 --report: 生成打包分析
```

同时会生成文件名/chunk名[映射文件](build/~fileName) (公共代码抽到`_`开头的文件里了)

### 其他命令

#### 指定入口(SPA 逗号分隔)

  1. 使用 [.env](.env) `_ENTRIES` 配置, 示例: `_ENTRIES=foo,bar`
  2. 通过cli命令: `entries` (覆盖1):

  ```bash
  yarn dev --entries=foo
  yarn build --entries=foo,bar
  ```

  可通过环境变量访问: `process.env.ENTRIES: string[]`

#### 指定路由配置(通过别名):

  1. `route` 目录结构

  ```bash
  ├── route # 全部路由配置文件夹(缺省指令)
  ├── route.foo # foo配置 指令: foo
  ├── route.bar # bar配置 指令: bar
  # ...
  ```

  2. 配置 [.env](.env) `_ALIAS`, 示例:

  ```bash
  # 配置别名, json: [
  #  [别名, 路径(相对根目录或入口), 默认指令(可省略)] 或者
  #  [别名, 路径, [允许的指令, ...], 默认指令(可省略)]
  #  ... ], 可使用cli命令指定指令(优先 --alias=foo.bar,bar.foo )
  _ALIAS=[["@fRoute", "foo/route", "foo"], ["@bRoute", "src/pages/bar/route", ["foo", "bar"], "bar"]]
  ```

  3. 通过cli命令: `alias`: `入口.指令,...`

  ```bash
  yarn dev --alias=foo.bar
  yarn build --alias=bar # 省略形式: 指令唯一时
  yarn build --alias=foo.bar,bar.foo
  ```

  可通过环境变量访问: `process.env.ALIAS: { [key in process.env.ENTRIES]: string[] }`

#### 命令帮助

```bash
yarn vue-cli-service help # [命令] : 比如 yarn vue-cli-service help test:e2e
```

### 联调

支持通过浏览器地址栏动态传递调试参数

- 环境变量`SEARCH_FIELD`: **所有**ajax请求将会把满足该正则的参数传递给服务端

- 动态代理字段, 通过`PROXY_FIELD`指定, 数字与静态代理(`BASE_PATH` + `PROXY_TARGET`)一致, 可以指定为环境变量名(比如 PROXY_TARGET)/ip/域名/完整url. 匹配的代理字段将**不会**传递给服务器

  ```bash
  # 若文件 .env.development 配置如下:
  # 相对路径(hash router)
  # BASE_PATH=foo
  # PROXY_TARGET=http://foo.com:666/foo
  # BASE_PATH1=bar
  # PROXY_TARGET1=https://bar.com:999/bar
  # PROXY_FIELD=proxy
  # SEARCH_FIELD=$PROXY_FIELD\d*

  # 访问如下url:
  http://{ip}:{port}/{path}?proxy=http://127.0.0.1/foo&proxy1=0.0.0.0
  # 结果: BASE_PATH 为 foo 的接口代理到 http://127.0.0.1/foo
  #      BASE_PATH 为 bar 的接口代理到 https://0.0.0.0:999/bar
  ```

## 说明及注意事项

### 目录结构

```bash
├── public # 静态文件目录, 除SPA模板(*.html)外, 直接复制到输出目录下
├── src # 源码目录
│   │── api # http通信
│   │── assets # 静态资源文件目录, 使用到的会被解析处理(比如图片等)
│   │── components # 提取的复用组件(文件夹分类, 未分类的基本就是基础组件了)
│   │── functions # 提取的复用逻辑(文件夹分类, 未分类的基本就是公用逻辑了)
│   │── config # 配置目录(输出到内联js, 可以直接修改而不用重新打包)
│   │── enums # 枚举目录
│   │── lang # 多语言目录
│   │── libs # 存储不(能)通过 npm 管理的第三方库/依赖库等相关
│   │── scss # 样式/CSS 对象(.module).scss 文件
│   │── skin # 皮肤文件(夹)
│   │── route # 路由配置
│   │── router # 路由逻辑
│   │── store # 状态管理
│   │   └── modules # 各模块状态管理
│   │── types # ts 接口/申明文件
│   │── utils # 工具集(业务无关, 一般为幂等函数/单例对象/Class...)
│   │── views # 视图
│   │── pages # 【可选】多页时页面的存储目录
│   │── html模板名 # 【可选】存放页面代码目录
│   └── (html模板名/main/index/entry/app/page).(ts|tsx|js|jsx) # 默认入口文件
├── tests # 测试用例目录
│   │── e2e # e2e 测试(cypress): https://www.cypress.io
│   └── unit # unit 测试(jest): https://jestjs.io
├── build # 脚本
│   └── ~fileName # 部署文件chunk名字典
├── dist # 生成的部署文件目录
├── .env # 所有环境的环境变量(满足正则/^[A-Z]+(?:_[A-Z]+)?$/的可通过process.env访问)
├── .env.[mode] # 指定环境的环境变量(mode: development/production/test)
├── .env.local/env.[mode].local # 本地环境变量(git忽略)
├── ... # 其他配置文件
└── vue.config.js # 配置入口(vue cli)
```

> 目录结构说明:

1. 只支持对 `public` 目录下的 html 模板(不包括子文件夹下的)自动设置入口, 规则为:

   1. 从 public 目录得到一个 html 模板
   2. 依次查找 src 目录、 src/pages 目录:
      1. 是否存在与 html 模板同名的(ts/tsx/js/jsx)文件且未占用
      2. 依次检查下列文件名: main/index/entry/app/page 是否存在且未占用
      3. 在与 html 模板同名的目录下重复**上两步**查找, 仍未找到则忽略

   建议: **单页入口直接放 src 目录下, 多页时入口分别放在 pages 目录下与 html 模板同名的文件夹下**

2. <a id="别名"></a>已有目录别名如下:

   - `@` => `src`
   - `@com` => `src/components`
   - `@{entry}` => 页面入口文件所在目录, 如: `@index`
   - `@{entry}Com` => 页面入口文件所在目录下的 `components` 目录(若存在), 如: `@indexCom`
   - [配置的别名](#指定路由配置通过别名)

   **Tips**: 在 `scss` 中使用 `~` 解析 `别名`/`依赖包`, 示例:

   ```html
   <!-- SomeView.vue -->
   <template>
     <div :class="$style.wrapper">
       <!-- 视为ts/js -->
       <img src="@/assets/logo.png" />
     </div>
   </template>

   <style lang="scss">
    @import '~normalize.css';
   </style>

   <style lang="scss" module>
    .wrapper {
      background: url(~@index/assets/bg.png);
    }
   </style>
   ```

3. `config` 目录下的所有内容都会被内联到对应`html`中(需要保留的注释请使用: `/*! 注释内容 */`), 用于支持直接修改配置而不必重新打包代码
4. 测试用例目录层级与文件名应尽量与源码对应

> **提示和建议**

- `src`下新建目录时应尽量复用现有目录名, 在保证结构清晰的情况下减少目录层级
- 目录及文件命名:

  **文件夹及其它文件**(js/scss/图片等)使用 `camelCase` (即: 首字母小写驼峰 = lowerCamelCase)

  **vue 单文件组件**(含[tsx](https://github.com/wonderful-panda/vue-tsx-support)/`ts`/`jsx`/`js`)使用 `PascalCase` ( 即: 首字母大写驼峰 = CamelCase = UpperCamelCase)

  例外情况:

  - 设计或重构(拆分)组件为多个部分的, **使用文件夹包裹**, 比如:

    ```TypeScript
    // BillList组件
    BillList
    │── index.(vue|tsx|ts|jsx|js) # 可以例外
    │── Item.vue
    └── ...

    // 使用BillList组件
    import BillList from '{path}/BillList'
    ```

- **先设计**功能模块/组件再(目录层级)向下细分或向上提取
- 越接近 src 目录的, 测试覆盖率也应越高; 被测试的代码应加注释`@test: true`表示在对应目录下包含测试用例, 否则指明测试代码路径或就近建`__tests__`目录; 修改了测试覆盖的代码后, 应视情况增加测试内容
- 尽量**不要使用全局注册**(插件/组件/指令/混入等)以优化性能并且代码更清晰、更易维护
- 尽量**按照依赖库的文档描述**来使用她, 从其源码(src)引入模块(css/scss/.../js/mjs/ts/jsx/tsx/vue), 将可能**不会被处理**且更可能随版本更新改变, 需要时可以从其构建后的 lib/dist 等目录引入或者增加一些配置(需要了解模块解析及转码规则和相关插件, 不推荐)
- 若开发环境出现缓存相关错误信息导致热更新慢, 可以删除 `node_modules/.cache` 文件夹再试
- 路由路径不应出现符号 `.` , 以方便 `history 路由` 模式开发/部署

### 风格建议

> 推荐使用 [TypeScript](https://www.tslang.cn)

- JavaScript/TypeScript 代码风格为 [**JavaScript standard**](https://standardjs.com/rules-zhcn.html), 主要有以下区别:

  - 使用单引号
  - 不要句尾分号
  - 多行末尾保留逗号
  - 方法名后不要空格

  (.vscode 文件夹为 VSCode 的工作区设置, 只在本工程生效, 已包含相关设置)

- 另请参考: [vue 风格指南](https://cn.vuejs.org/v2/style-guide/) **推荐(C)及以上** 和 [stylelint](https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md) [配置](.stylelintrc.js)
- `optional/OOP/functional`之争看来大趋势是`functional`了, 故推荐`optional`组件, 方便迁移到 Vue3
- 请直接使用`ES6+`, 除了`Proxy`等极少数不能shim和polyfill的(实际业务也极少用到), 不需要考虑兼容, 也不要做没必要/效果微弱的的优化(我检讨), 优先考虑代码**可读性**
- 引用 `vue/tsx/ts/js/jsx` **不要加文件扩展名** 且省略 `/index`, 有利于重构代码
- 在`tsx/jsx`中使用**全局组件**时应使用`kebab-case`, 否则会在控制台输出错误 ┐(: ´ ゞ｀)┌

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

- `enum/type/interface` 需要导出的直接 `export` (否则可能会得到 undefined), 其他的除了字典(硬编码)和只有默认导出的外, 先定义再`export`(IDE 提示更友好), 并且`export`语句放到最后
- 不要使用 `$` 作为组件事件名, 该名字已被[异步组件刷新](src/components/hoc)占用
- **私有属性**命名规则(避免 [属性名](https://cn.vuejs.org/v2/style-guide/#私有属性名-必要) 冲突):
  - `$_` 实例属性名前缀(在保证易维护的前提下可以使用单字母, 但应尽量避免)
  - `_$` **全局/跨组件/hack**属性名前缀, 命名前应**先全局搜索**是否有重复
  - `/^[^$_]+_$/` 注入**vue data 选项**的属性名应满足该正则, 即以`_`结尾(以`$_`其中一个字符开头的Vue会略过), 命名前应**先全局搜索**是否有重复

- 除了以下情况外, 不应使用全局样式:

  - 浏览器默认样式重置
  - 通用 `Transition` 动画样式
  - 通用字体图标样式
  - 基础组件样式(按照[BEM](https://en.bem.info)约定命名[参考链接](https://www.ibm.com/developerworks/cn/web/1512_chengfu_bem/))

  应使用 [CSSModule](https://vue-loader-v14.vuejs.org/zh-cn/features/css-modules.html)(开发环境class名:`[folder]__[name]_[local]-[emoji]$`), 以更好地实现模块化(支持复用)

- CSS Modules class 名使用 `camelCase`, 选择器嵌套**不应超过三层**
- <a id="scss变量"></a>**皮肤文件**(`*.scss`) _(包含<a href="#别名">各别名</a>下GLOBAL_SCSS环境变量指定的文件)_ 中不要出现具体样式, 也不要有[`:export{}`](https://github.com/css-modules/icss#export) (`:export{}`应在 `scss/export` 目录下或 `export*.scss` 中使用)
- 为保证在`ts/js`中引入scss文件时, 变量注入正确(使用缓存会导致无法对相同文件注入不同变量，不用缓存显然不好而且也不支持), 应在合适的位置新建 scss 文件来中转:

  ```scss
  /// el.scss
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

    @Component({ components: { ElButton } })
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

  (注: 可能出现注入不正确的情况比如各个入口的 skin 不一样但是使用了相同 scss 文件)

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

- 尽量使用代码模板, 现有模板有(VSCode 输入左侧字符, 其他 IDE 查看[模板](.vscode/vue.code-snippets)):
  - `ts`: `.vue` 文件中使用, `TypeScript + scss module`
  - `vue`: `.tsx` 文件中使用, `TypeScript`
  - `ts-class`: `.vue` 文件中使用, `TypeScript(Class) + scss module`
  - `vue-class`: `.tsx` 文件中使用, `TypeScript(Class)`
  - `vuex`: `.ts` 文件中使用, `dynamic vuex class module`
  - `js`: `.vue` 文件中使用, `JavaScript + scss module`
  - `vue`: `.jsx` 文件中使用, `JavaScript`
  - `js-class`: `.vue` 文件中使用, `JavaScript(Class) + scss module`
  - `vue-class`: `.jsx` 文件中使用, `JavaScript(Class)`
  - `vuex`: `.js` 文件中使用, `dynamic vuex class module`
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

- 关于换肤方案, 本模板采用 `alternate stylesheet`[方案](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets), 基于`scss`变量注入同时构建多个皮肤. 可通过环境变量[.env](.env)进行相关配置, 在`import` **scss** 文件时可以指定皮肤和使用的 scss 变量

  ```html
  <script lang="ts">
    /// 基础样式(所有皮肤下都生效) ///
    import './scss/a.scss?skin='
    // 指定scss变量文件相对路径(别名|皮肤文件(相对皮肤文件夹))
    import './scss/b.scss?skin=|foo.scss'

    /// 皮肤样式 ///
    import './scss/c.scss'
    import D from './scss/d.module.scss'

    /// 指定皮肤样式 ///
    import './scss/e.scss?skin=dark'
    import './scss/f.scss?skin=light'

    // CSS Module
    import getSkin from '@/skin'
    import dark from './scss/g.module.scss?skin=dark|foo.scss'
    import light from './scss/g.module.scss?skin=light|bar.scss'

    import { Component, Vue } from 'vue-property-decorator'

    const G = getSkin({ dark, light })

    @Component
    export default class extends Vue {
      private get D() {
        return D
      }

      private get G() {
        return G
      }
    }
  </script>

  <!-- 基础样式 -->
  <style lang="scss" module skin="|">
  .bar {
    display: none;
  }
  </style>
  <style lang="scss" module skin="|foo.scss">
  .bar {
    color: $red;
  }
  </style>
  <!-- 皮肤样式 -->
  <style lang="scss" module>
  .foo {
    color: $red;
  }
  </style>
  <!-- 指定皮肤样式【不支持CSS Module】 -->
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

- 正确规范([JSDoc](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc))简洁适当的各种**注释**:

  ```TypeScript
  /** 二维点 */
  interface IPoint {
    x: number
    y: number
    /** 描述 */
    desc?: string
  }
  /** 角度转弧度常量 */
  const ANGLE_RADIAN = Math.PI / 180
  /** 计算圆上的点
   *
   * @param center 圆心
   * @param radius 半径
   * @param angle 角度
   *
   * @returns 圆上的点坐标
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
  // if return / 策略 ｂ(￣▽￣)ｄ
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

- [异步 chunk](https://webpack.docschina.org/api/module-methods) 使用层次命名(方便排查问题和碎文件合并), 比如: index 页面下的 home 视图命名为 `index_home`, 其下的用户视图命名为 `index_home_me`, 用户基础信息命名为 `index_home_me_baseinfo` . 为避免文件名太长, 可以缩写为: `iHome`, `ihMe`, `ihmBaseInfo`
- libs 下的库文件模块化懒加载示例(只会成功加载一次):

  ```TypeScript
  /// src/libs/somelib/index.ts
  /** 模块化异步引入somelib及其插件(全局类似)
  * @param plugins 需要加载的somelib插件名列表:
  *
  *   plugin1: 插件1
  *
  *   plugin2: 插件2
  *
  *   ...
  *
  * @returns {Promise<Array<Module>>} 模块
  */
  export default (plugins: string[] = []): Promise<any> => {
    let somelib: any
    return import(/* webpackChunkName: "lSomelib" */ './somelib.min')
      .then((module: any) => {
        somelib = module.default
        return Promise.all(plugins.map((plugin: string) => {
          switch (plugin) {
            case 'plugin1':
              return import(/* webpackChunkName: "lsPlugins" */ './somelib.plugin1.min')
            case 'plugin2':
              return import(/* webpackChunkName: "lsPlugins" */ './somelib.plugin2.min')
            // 上面两个插件合并到同一个chunk里
            // ...
          }
        }) as Array<Promise<any>>)
      })
      // 注册插件(略), 返回somelib
      .then((modules: Array<Promise<any>>) => somelib)
  }

  /// src/pages/index/components/Foo.vue
  import get from '@/libs/somelib'

  @Component
  export default class extends Vue {
    private init() {
      get(['plugin2']).then((somelib: any) => somelib.init(this.$refs.panel))
    }
  }
  ```

- 所有视图组件可接收props:`route`代替`this.$route`, 区别是: **只在首次进入当前视图或当前视图url发生变化时改变**
- **路由视图**不需要被缓存的, 可以在`meta`申明/`deactivated`钩子销毁实例(`this.$destroy()`)或`activated`钩子进行更新
- 为避免渲染错误, 请务必为 <b style="color: red;">循环创建的组件</b> **加上 `key`**, 需要特别注意 `tsx/ts/jsx/js` 文件(没有代码提示)

### 配置和优化

可通过 [vue.config.js](vue.config.js) (入口)文件配置工具链; `.env.*` 配置环境变量; 根目录下各配置文件配置相应工具

#### 优化

- 减小图片大小(比如背景图片等)
- 对多个 js chunk 共同依赖的模块进行缓存/单独提取, 大模块只出现在一个chunk里(cacheGroups)
- 相同chunk下的基础样式和各个皮肤样式文件分别合并 或 其他合理的合并策略【webpack 5 支持设置 css chunk 的 minSize/maxSize 啦】
- [现代模式](https://cli.vuejs.org/zh/guide/browser-compatibility.html#现代模式)
- 打包/热更新慢:
  1. [热更新]使 `hard-source-webpack-plugin` (动态缓存结果文件)在开发环境排除`src`文件夹生效
  2. [热更新]开发环境减少js(ts必须编译)转码/编译工作量, 比如保留最新ES标准语法, 更进一步可以配合模块加载方式(`<script type="module">` 参考[vite](https://github.com/vuejs/vite)), 但这需要使用最新浏览器调试且调试时不会暴露兼容性问题
  3. [热更新]开发时指定需要的模块, 比如指定路由
    - 优点: 只需构建指定模块, 提升热更新效率
    - 缺点: 需要其他模块时需要重新指定
  4. (第三方)依赖静态化[不推荐]
    - 优点: 静态化依赖只需一次构建; 支持CDN加载(可供多个应用使用)
    - 缺点: 通常会增加文件体积(无法tree-shaking)/数量(不能合并), 可能导致全局变量污染; CDN维护更新/版本管理
  5. **下一代方案**: 使用 [esbuild](https://github.com/evanw/esbuild) 提升构建/压缩速度

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

## 部署(nginx)

- url 重写`rewrite`兼容旧版
- 反向代理, 绕过同源策略限制(api/图片等资源跨域等)
- 开启 `gzip` 压缩, 并重用已有 `gz` 文件 `gzip_static on;`
- 缓存静态资源(html 可减少缓存时间)
- [HTTP2 Server Push](https://www.nginx.com/blog/nginx-1-13-9-http2-server-push) 服务器推送, 需要 `nginx` 版本**1.13.9**及以上, [文档链接](http://nginx.org/en/docs/http/ngx_http_v2_module.html#http2_push_preload)
- 多个SPA(即 `html` 文件)以**history路由**(访问url不以`#`号标识)部署:
  - 一个 `html` 一个 location 或 待运维大佬完善(示例如下)
  - 按照注释修改**每个** `html` 的配置, 其中 `base` 改为对应访问路径

配置示例( `nginx.conf` 文件, `xxx` 换成对应值):

```bash
http {
  include       xxx/mime.types;
  default_type  application/octet-stream;

  # log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
  #                  '$status $body_bytes_sent "$http_referer" '
  #                  '"$http_user_agent" "$http_x_forwarded_for"';
  # access_log  xxx/access.log  main;

  sendfile        on;
  # tcp_nopush     on;

  keepalive_timeout  90;
  # underscores_in_headers on; # 允许带下划线的请求头

  # 开启gZip(图片除外)
  gzip on;
  gzip_vary on;
  gzip_static on;
  gzip_proxied any;
  gzip_comp_level 3;
  gzip_min_length 3k;
  gzip_buffers 32 16k;
  gzip_types application/xml application/json application/ld+json application/rss+xml application/atom+xml application/xhtml+xml application/font-woff application/x-font-ttf application/x-javascript application/javascript application/x-httpd-php application/x-font-woff application/vnd.geo+json application/octet-stream application/manifest+json application/vnd.ms-fontobject application/x-web-app-manifest+json font/opentype text/vtt text/css text/plain text/vcard text/javascript text/x-component text/cache-manifest text/vnd.rim.location.xloc text/x-cross-domain-policy image/svg+xml;

  # server {
      # http 跳转到 https
  #   server_name  xxx;
  #   listen       80;
  #   listen       [::]:80;

  #   return 301 https://$host$request_uri; # 得用 $host,不造为啥 $server_name 不行
  # }

  server {
    # server_name  xxx;
    # http
    listen       80;
    listen       [::]:80;
    # https + http2
    listen       443 ssl http2;
    listen       [::]:443 ssl http2;

    ssl_certificate      xxx.crt; # 证书
    ssl_certificate_key  xxx.key; # 私匙
    ssl_session_cache    shared:SSL:5m; # 共享会话缓存大小
    ssl_session_timeout  15m; # 会话超时时间
    # ssl_protocols        TLSv1 TLSv1.1 TLSv1.2;
    # ssl_ciphers          HIGH:!aNULL:!MD5; # 定义算法
    # ssl_prefer_server_ciphers  on; # 优先采取服务器算法

    client_max_body_size 10m; # 请求体大小限制 for上传文件

    # http2_push_preload on; # 开启服务器推送
    # add_header Set-Cookie "session=1"; # 添加cookie标识首次访问
    # add_header Link $res; # 添加响应头 Link 指定要推送的文件, 使用自定义变量 res

    # 安全性
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always; # HSTS策略
    add_header X-Frame-Options DENY; # 减少点击劫持
    add_header X-Content-Type-Options nosniff; # 禁止服务器自动解析资源类型
    add_header X-Xss-Protection 1; # 防XSS攻擊

    # error_page 500 502 503 504  /50x.html; # 错误页
    # error_page 404              /404.html; # 未知页

    location / {
      # rewrite ^/(?:path|path-alias)/(.*)$ /$1 last; # 兼容某些url
      # 设置静态资源缓存(文件名已带内容哈希了)
      if ($uri ~ .*\.(?:js|css|jpg|jpeg|gif|png|ico|gz|svg|svgz|ttf|eot|mp4)$) {
        expires 7d; # d: 天
      }
      # html(文件名不变)
      if ($uri ~ .*\.(?:htm|html)$) {
        expires 25m; # m: 分钟
        # add_header Cache-Control private,no-store,no-cache,must-revalidate,proxy-revalidate;
      }

      index index.html;
      alias xxx/;

      set $u /; # for 多页history路由 其他location: ^/location([^/]+)
      if ($uri ~ ^/([^/]+)) {
        set $u $1.html; # 待测试并完善
      }
      try_files $uri $uri/ $uri.html $u / =404;
      # try_files $uri $uri/ $uri.html /location$u /location =404;
    }
    location /api {
      proxy_pass https?://xxx:xxx/xxx;
      # http2_push_preload on; # 转发 Link 响应头
      # 缓存策略...
    }

  }

  # 根据cookie映射变量res
  # map $http_cookie $res {
  #  "~*session=1" ""; # session为1时返回空字符串
  #  # nopush: 若客户端存在缓存就不推送了
  #  default "</style.css>; as=style; rel=preload; nopush, </image2.jpg>; as=image; rel=preload; nopush, </index.js>; as=script; rel=preload; nopush";
  # }
}
```

(似乎也没必要)补全字体图标配置(`mime.types` 文件):

```diff
  font/woff                                        woff;
  font/woff2                                       woff2;
+ font/ttf                                         ttf;
+ font/opentype                                    otf;
  application/vnd.ms-fontobject                    eot;
```

## 备忘

### 文档

| [scss](https://www.sass.hk/docs)
| [vue](https://cn.vuejs.org)
| [vuex](https://vuex.vuejs.org)
| [vue-router](https://router.vuejs.org)
| [vuex-class](https://github.com/ktsn/vuex-class)
| [vue-class-component](https://github.com/vuejs/vue-class-component)
| [vuex-module-decorators](https://championswimmer.in/vuex-module-decorators/)
| [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)
| [vue-i18n](http://kazupon.github.io/vue-i18n)
| [element-ui](https://element.eleme.cn)
| [axios](https://github.com/axios/axios)
| [crypto-js](http://cryptojs.altervista.org)
| [jsencrypt](http://travistidwell.com/jsencrypt)
| [npm](https://docs.npmjs.com/files/package.json)

#### 图形库

2D

| [ECharts](https://echarts.baidu.com/api.html#echarts)
| [zrender](https://ecomfe.github.io/zrender-doc/public/api.html)
| [d3](https://github.com/d3/d3/wiki)
| [zdog](https://zzz.dog)
| [pixi.js](https://www.pixijs.com) _(WebGL2/WebGL)_

3D

| [three.js](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene) _(WebGL2/WebGL)_
| [luma.gl](https://luma.gl/#/documentation/api-reference/api-overview/api-structure) _(WebGL2/WebGL)_

### 笔记

- 在 `ts/js` 中使用 `assets` 目录下的图片可以 `import IMG from '@/assets/img/*.png'`(或 require), `IMG`为图片输出路径或 base64 字符串, 其他类似(新的文件格式需要配置 loader 和补充[ts 定义](src/shims-modules.d.ts))
- 在 `scss` 中引入 `css` ([@import](https://www.sass.hk/docs)) 有两种方式
  1. 【推荐】不带文件后缀, css 文件内容会被合并到当前文件, 比如: `@import '~normalize.css';`
  1. 带文件后缀, 会处理成 css 的[@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import), 比如: `@import '~normalize.css/normalize.css';`
- 文件下载(需要token且在请求头设置)

  ```TypeScript
  import { get } from '@/utils/ajax' // 登陆后已设置请求头携带token

  get('', { id: '' }, { responseType: 'blob' }).then(res => {
    let fileName = res.headers['content-disposition'].split(';')
    fileName = fileName[fileName.length - 1].split('=')
    fileName = fileName[fileName.length - 1]
    const href = window.URL.createObjectURL(new Blob([res], { type: res.type }))

    const link = document.createElement('a')
    link.style.display = 'none'
    link.download = fileName
    link.href = href

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(href)
  })
  ```

- 提交时 `lint-stage` 【10.0.8已修复】会删除未暂存的新增文件(撤销全部未暂存修改), 待相关命令(比如lint)执行完后再恢复, 所以若报错, 被删除的文件将**无法恢复**, 解决方案有如下几种:
  1. 确保未暂存的文件里没有新增的, 或者在编辑器打开或手动备份新增的文件用以恢复. 最好能控制好提交粒度, 全部暂存后再提交
  2. 先执行 `yarn lint` 等相关命令, 待消除所有错误后, 再提交
  3. 确保开发时无相关报错(浏览器中页面遮罩显示错误, 控制台打印警告), 特别注意 `console.log` , `debugger` 和 `定义但未使用变量`, 只在开发环境是警告, 其他都是错误

- 图标概率乱码: `scss` 压缩模式下 (compressed mode) 使用 UTF-8 byte order mark (UTF-8 with BOM) 代替 @charset 声明语句导致, 暂时先使用css `import 'element-ui/lib/theme-chalk/base.css'`

### 问题及思考

- Vue 异步组件加载失败重试: 最好还是 Vue 对异步组件提供支持[#9788](https://github.com/vuejs/vue/issues/9788)
- 现代模式(只针对 js 文件): 优先使用模块加载(体积更小执行更快, `<script type="module">` & `<link rel="modulepreload">`); 不支持时回退到普通加载(`<script nomodule>` & `<link rel="preload">`)
- [#714](https://github.com/webpack-contrib/sass-loader/issues/714): 【不再考虑支持】可追踪引用, 使在 js 中引用 scss 时可正确<a href="#scss变量">注入 scss 变量</a>
- scss 模块化: 已出 beta 但生态不完善, [草案](https://github.com/sass/sass/blob/master/accepted/module-system.md)
- [微前端化](https://github.com/phodal/microfrontends#复合型): 应考虑基于 [Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components) ([vue 友好](https://cli.vuejs.org/zh/guide/build-targets.html#web-components-组件), 可以兼容其他) 的集成和通信.
- `tsx` 类型支持(去掉`as any`, 利于重构)
- 只下载当前皮肤(暂无必要, 不影响性能, 未验证移动端换肤方案是否可行)

### 其他

- 观望 [deno](https://github.com/denoland/deno)
- 期待 [vue3.0](https://github.com/vuejs/vue/projects/6)及其生态正式版 & [webpack 5.0](https://github.com/webpack/webpack/projects/5) [正式版](https://github.com/webpack/changelog-v5/blob/master/README.md)
- `crypto-js` v4 **不支持 IE10**
- `TypeScript`(3.8.2) `const enum` 编译为内联代码(`inline code`)的支持有限, 尽量使用常量成员, 然后等[更新](https://github.com/microsoft/TypeScript)吧