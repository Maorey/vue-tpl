# vue-tpl

vue + vuex + vue router + TypeScript(支持 JavaScript) 脚手架

[更新日志](releaseLog.md)

- [命令参考](#命令参考)
  - [安装项目](#安装项目)
    - [可选项](#可选项)
  - [开发环境（开发调试时使用）](#开发环境开发调试时使用)
  - [构建项目（生成部署文件）](#构建项目生成部署文件)
  - [代码风格检查和修正（提交 Git 时会自动执行）](#代码风格检查和修正提交-git-时会自动执行)
  - [e2e(end-to-end) 测试](#e2eend-to-end-测试)
  - [单元测试](#单元测试)
  - [命令帮助](#命令帮助)
- [说明及注意事项](#说明及注意事项)
  - [目录结构](#目录结构)
  - [风格建议](#风格建议)
  - [其他建议](#其他建议)
  - [优化](#优化)
    - [web 页面](#web%20页面)
    - [工程](#工程)
  - [IDE](#ide)
- [部署（nginx）](#部署nginx)
- [备忘](#备忘)
  - [文档](#文档)
    - [数据可视化](#数据可视化)
  - [问题及思考](#问题及思考)
  - [笔记](#笔记)
  - [其他](#其他)

## 命令参考

以`yarn`为例（使用`npm`或`cnpm`替换`yarn`命令即可）:

### 安装项目

```bash
yarn install # 安装依赖
git config core.ignorecase false # 使git对文件名大小写敏感
```

#### 可选项

- [点击链接](http://editorconfig.org)确定所用 IDE 是否需要安装插件 _(用于跨 IDE 设置，VS Code 需要安装插件，但因为提交了.vscode 文件夹，所以不装也行)_

- 可以如下设置增加使用 node ([V8](https://segmentfault.com/a/1190000000440270)) 的内存上限

  ```bash
  # /node_modules/.bin 目录下 找到文件 webpack.cmd 文件，如下设置
  # 增加启动参数 --max_old_space_size=4096 (单位M，老生代内存)
  # 可用 node --v8-options 命令查看当前 nodeJS的 V8配置

  @IF EXIST "%~dp0\node.exe" (
    "%~dp0\node.exe" --max_old_space_size=4096 "%~dp0\..\webpack\bin\webpack.js" %*
  ) ELSE (
    @SETLOCAL
    @SET PATHEXT=%PATHEXT:;.JS;=;%
    node --max_old_space_size=4096 "%~dp0\..\webpack\bin\webpack.js" %*
  )

  ```

### 开发环境（开发调试时使用）

```bash
yarn run dev # --port 9876 : 本次启动使用9876端口 (可以在 .env.development.local 文件中设置)
```

### 构建项目（生成部署文件）

```bash
yarn run build # --watch: 跟踪文件变化 --report: 生成打包分析
```

同时会生成[fileName.map](scripts/fileName.map)记录 文件名/chunk 名映射 (公共代码抽到`v.`开头的文件里了)

### 代码风格检查和修正（提交 Git 时会自动执行）

```bash
yarn run lint
```

### e2e(end-to-end) 测试

```bash
yarn run test:e2e
```

### 单元测试

```bash
yarn run test:unit # --watch : 跟踪文件变化
```

### 命令帮助

```bash
yarn run vue-cli-service help # [命令] : 比如 yarn run vue-cli-service help test:e2e
```

## 说明及注意事项

### 目录结构

```bash
├── public # 静态文件目录，除特殊文件（比如 html 模板）外**直接复制到输出目录下**
├── src # 源码目录
│   │── api # 分模块存放与各个 api 进行交互的函数
│   │   └── config # api 相关配置，比如接口字典、响应数据字典等
│   │── assets # 静态资源文件目录，使用到的会被解析处理(比如图片可能转成base64写入css/js或复制到输出目录)
│   │── components # 项目组件
│   │── config # 配置目录
│   │── lang # 多语言目录
│   │── libs # 存储不(能)通过 npm 管理的第三方或项目 js/css 库
│   │── scss # scss/scss、CSSModule 文件
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
│   │── e2e # e2e 测试: https://nightwatchjs.org
│   └── unit # unit 测试: https://jestjs.io/docs/zh-Hans/getting-started.html
├── scripts # 脚本
├── .env、.env.* # 环境变量设置
├── tsconfig.json # typeScript 配置: https://www.tslang.cn/docs/handbook/tsconfig-json.html
├── tslint.json # tslint 配置: https://palantir.github.io/tslint/rules/
└── vue.config.js # 脚手架(vue cli)配置入口
```

> 目录结构说明:

1. 只支持对 `public` 目录下的 html 模板(不包括子文件夹下的)自动设置入口，规则为:

   1. 遍历 public 下的 html 模板文件，得到一个 html 模板
   2. 依次对 src 目录及 src/pages 进行如下查找:
      1. 若该目录下存在与该 html 模板名同名的 ts/tsx/js/jsx 文件则设置为入口，未找到或已占用则**↓**
      2. 依次检查下列文件名: main/index/entry/app/page 设置为入口，未找到或已占用则**↓**
      3. 在该目录下与 html 模板同名的目录下按照**上述**规则继续查找，最终仍未找到或已占用则不设置入口

   建议：**单页入口直接放 src 目录下，多页时入口分别放在 pages 目录下与 html 模板同名的文件夹下**

2. <a id="别名"></a>已有目录别名如下:

   - `@` -> `src`
   - `@com` -> `src/components`
   - `@{entry}` -> 页面入口文件所在目录，如: `@index`
   - `@{entry}Com` -> 页面入口文件所在目录下的 `components` 目录，如: `@indexCom`

   **Tips**: 在 `scss` 中使用 `~` 解析 `别名`/`依赖包` 对应目录。 示例:

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
4. 所有 `config` 目录下的内容都会被打包到同一个文件`conf.*.js`(需要保留的注释请使用: `/*! 注释内容 */`)，用于支持直接修改配置而不必重新打包代码
5. 除了以下样式可以使用全局:

   - 浏览器默认样式重置
   - `Transition` 动画样式
   - 字体图标样式
   - 公共组件默认样式(使支持换肤，使用[BEM](https://en.bem.info)约定[参考链接](https://www.ibm.com/developerworks/cn/web/1512_chengfu_bem/))

   均应使用 [CSSModule](https://vue-loader-v14.vuejs.org/zh-cn/features/css-modules.html)，以更好的模块化和复用、打包样式

6. 测试用例目录层级与文件名应尽量与源码对应

> **提示和建议**

- 新建目录时尽量复用上述列出的目录名，保证结构清晰的情况下减少目录层级
- 目录及文件命名:

  **文件夹及其它文件**(js/scss/图片等)使用 `camelCase` (即：首字母小写驼峰 = lowerCamelCase)

  **vue 单文件组件**(含[tsx](https://github.com/wonderful-panda/vue-tsx-support)/`jsx`/`functional.(ts|js)`)使用 `PascalCase` ( 即：首字母大写驼峰 = CamelCase = UpperCamelCase)

  例外情况(方便重构):

  - 组件包含不可复用的子组件时，应视为一个组件, 创建**文件夹容器**，比如:

    ```TypeScript
    // BillList组件
    BillList
    │── index.vue # 可以例外
    │── Item.vue
    └── ...

    // 使用组件
    import BillList from '{path}/BillList'
    ```

    或者

    ```TypeScript
    // BillList组件
    BillList
    │── index.tsx # 可以例外
    │── Item.vue
    └── ...

    // 使用组件
    import BillList from '{path}/BillList'
    ```

- 视图只负责布局及交互(props 传递和事件监听)，包含子组件的可使用**文件夹容器**方式或将子组件存放在对应层级的 `components` 目录下的同名目录(`camelCase`)下
- 公共组件/逻辑/函数/样式等模块请按照: `模块 -> 视图 -> 页面 -> 项目` 的层级提升, 配合**提前规划**确定初始层级
- 越高的层级测试覆盖率也应越高; 被测试的代码应加注释`@test: true`表示在对应目录下包含测试用例,否则指明路径; 修改了测试覆盖的代码后，应视情况增加测试内容并运行测试，以保证功能和行为与之前一致
- 尽量**不要使用全局注册**(插件/组件/指令/混入等)以优化打包和使代码更清晰、易维护
- 组件尽量**按逻辑和呈现拆分**以更好的复用和维护
- 尽量**按照依赖库的文档描述**来使用她，从其源码(src)引入模块(css/scss/.../js/mjs/ts/jsx/tsx/vue)，将可能**不会被转译**且更可能随版本更新改变，需要时可以从其构建后的 lib/dist 等目录引入或者增加一些配置(需要了解模块解析及转码规则和相关插件，不推荐)

### 风格建议

推荐使用 [TypeScript](https://www.tslang.cn)

- CSS Modules class 名使用 `camelCase` (global 可以 kebab-case), 选择器嵌套**不应超过三层**
- JavaScript 代码风格为 [**JavaScript standard**](https://standardjs.com/rules-zhcn.html)，除了以下区别:

  - 使用单引号
  - 不要句尾分号
  - 多行末尾保留逗号
  - 方法名后不要空格

  （.vscode 文件夹为 VSCode 的工作区设置，只在本项目生效，已包含 Prettier、ESLint 插件相关设置）

- 另请参考: [vue 风格指南](https://cn.vuejs.org/v2/style-guide/) **推荐(C)及以上**和 [tslint.json](tslint.json)
- 在`jsx/tsx`中使用全局注册的组件时可以使用`kebab-case`, 否则会在控制台输出错误 ┐(：´ ゞ｀)┌

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

- 引用 vue 单文件组件**不要加文件扩展名**，有利于重构代码
- 先定义再`export`(IDE 提示更友好), 并且`export`语句放到最后
- <a id="全局scss"></a>**全局 sccs** _(包含<a href="#别名">各别名</a>下[.env](.env) `GLOBAL_SCSS`变量指定的文件)_ 中不要出现具体样式, 也不要有[`:export{}`](https://github.com/css-modules/icss#export); 为保证`ts/js`中引入时 scss 变量注入正确 _(从近到远依次注入所属别名目录下的指定文件)_, 应在适合的 scss 文件中引入目标样式源码:

  ```scss
  // el.scss
  @import '~element-ui/packages/theme-chalk/src/button.scss';
  ```

  ```html
  <template>
    <ElButton>默认按钮</ElButton>
  </template>

  <script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'

    import { Button as ElButton } from 'element-ui'
    import './el.scss'

    @Component({
      components: { ElButton },
    })
    export default class extends Vue {}
  </script>
  <!-- 也可以在这儿引用
  <style lang="scss">
    @import '~element-ui/packages/theme-chalk/src/button.scss';
  </style> -->
  ```

  或

  ```TypeScript
  import { CreateElement } from 'vue'
  import { Component, Vue } from 'vue-property-decorator'

  import { Button as ElButton } from 'element-ui'
  import './el.scss'

  @Component
  export default class extends Vue {
    private render(h: CreateElement) {
      return <ElButton>默认按钮</ElButton>
    }
  }
  ```

- **不要用全局样式覆盖全局样式**, 应使用 `CSSModule` 并使[优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)相等(注意顺序，包括同步/异步)或更高:

  ```scss
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

- 尽量使用项目代码模板，现有模板有(VSCode 输入左侧字符, [其他 IDE](.vscode/vue.code-snippets)):
  - `ts`: `TypeScript` & `CSS Module`, vue 单文件组件中使用
  - `vue`: `TypeScript` & `CSS Module`, `tsx` 文件中使用
  - `js`: `JavaScript` & `CSS Module`, vue 单文件组件中使用
  - `vue`: `JavaScript` & `CSS Module`, `jsx` 文件中使用
- 提交代码请使用标识: Add/Del/Fix/Mod 等

### 其他建议

- 规范优雅正确适当的各种**注释**，比如方法注释及必要的变量注释：

  ```TypeScript
  // math.ts
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

  分支注释：

  ```TypeScript
  // logic.ts
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

- [异步 chunk](https://webpack.docschina.org/api/module-methods) 使用入口层级命名(方便排查问题和碎文件合并)，比如: index 页面下的 home 视图命名为 `index_home`, 其下的用户视图命名为 `index_home_my`, 用户基础信息命名为 `index_home_my_baseinfo` 。为避免文件名太长，每个层级可以缩写: `iHome`, `ihMy`, `ihmBaseInfo`。
- libs 下的库文件需要按需加载的，应提供引入方法（只会成功加载一次），比如(模块化, 全局的类似):

  ```TypeScript
  // src/libs/somelib/index.ts
  /** 异步引入somelib(模块化)及其插件
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
      // 注册插件(略)，返回somelib
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

### 优化

#### web 页面

请参照 [vue.config.js](vue.config.js) 文件中 _chainWebpack_ 的注释进行配置

- 减小图片大小(比如背景图片等)
- 对多个 js chunk 共同依赖的模块进行缓存/单独提取(cacheGroups)
- 视情况对 css 文件进行合并(比如按入口等，不设置则按 chunk)【webpack 5 支持设置 css chunk 的 minSize/maxSize 啦】
- [现代模式](https://cli.vuejs.org/zh/guide/browser-compatibility.html#现代模式)

#### 工程

因为模块加载，所以不能预编译依赖库；依赖库的 scss 文件倒是可以用下 cache-loader；暂未找到更多可优化内容(run scripts 确实慢 ┐(：´ ゞ｀)┌)

### IDE

推荐使用： **Visual Studio Code** (VSCode)，推荐插件：

- Vetur: vue 开发必备
- ESLint & TSLint: 代码检查
- Prettier - Code formatter: 代码格式化
- GitLens: Git 工具

推荐工具： [`@vue/cli`](https://cli.vuejs.org/zh/guide)，全局安装时可使用 `vue ui` 命令启动图形化界面管理项目

## 部署（nginx）

简记如下，有待运维大佬进一步优化

1. url 重写兼容旧版
2. 反向代理，绕过同源策略限制（api/图片等资源跨域等）
3. 添加请求头字段 `access_token` 使后台能读到该字段（nginx 的 http 或 server 节点下需要添加配置`underscores_in_headers on; # 允许带下划线的请求头`）
4. 开启 `gzip` 压缩，并重用已有 gz 文件 `gzip_static on;`
5. 缓存静态资源(html 可减小缓存时间)

配置示例(`{value}` 换成对应值):

```bash
server {
  listen       {port};
  server_name  {domain};

  underscores_in_headers on; # 允许带下划线的请求头

  # 开启gZip
  gzip on;
  gzip_vary on;
  gzip_static on;
  gzip_proxied any;
  gzip_comp_level 3;
  gzip_min_length 3k;
  gzip_buffers 32 16k;
  # gzip_http_version 1.0;
  gzip_types application/xml application/json application/ld+json application/rss+xml application/atom+xml application/xhtml+xml application/font-woff application/x-font-ttf application/x-javascript application/javascript application/x-httpd-php application/x-font-woff application/vnd.geo+json application/octet-stream application/manifest+json application/vnd.ms-fontobject application/x-web-app-manifest+json font/opentype text/vtt text/css text/plain text/vcard text/javascript text/x-component text/cache-manifest text/vnd.rim.location.xloc text/x-cross-domain-policy image/svg+xml;

  # 部署在根目录 直接访问域名
  location / {
    # rewrite ^/app/(?:path|path-alias)/(.*)$ /app/$1 last; # 兼容某些路由
    proxy_set_header access_token ''; # 添加允许的请求头

    # 设置静态资源缓存(文件名带内容哈希)
    if ($uri ~ .*\.(?:js|css|jpg|jpeg|gif|png|ico|gz|svg|svgz|ttf|eot|mp4)$) {
        expires 7d; # 7天
    }
    # html（文件名不变）
    if ($uri ~ .*\.(?:htm|html)$) {
        expires 25m; # 25分钟
        #add_header Cache-Control private,no-store,no-cache,must-revalidate,proxy-revalidate;
    }

    index index.html;
    try_files $uri $uri.html $uri/  /; # 使支持history路由
    root {path};
  }

  # 部署在其他目录 访问域名/目录
  location /app {
    # 略

    index index.html;
    try_files $uri $uri.html $uri/ /app/;
    alias {path};
  }


  # 接口代理
  location /api/ {
    proxy_pass http://{ip}:{port}/{path}/;
    # 缓存策略...
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

### 问题及思考

- **Vue 异步组件加载失败重试**: 最好还是 Vue 对异步组件提供支持[#9788](https://github.com/vuejs/vue/issues/9788)
- 现代模式(只针对 js 文件): 该模式优点是若浏览器支持 ES2015 则加载 ES2015 代码(体积更小执行更快，`<script type="module">` & `<link rel="modulepreload">`)；不支持则加载 Babel 转码后的代码(`<script nomodule>` & `<link rel="preload">`)。但是不知何故未能生效，github 上有一些相关 issue

### 笔记

- 在 `ts/js` 中使用 `assets` 目录下的图片可以通过 `require('@/assets/img/*.png')`(或 import), 将得到输出路径或 base64 字符串, 其他类似(新的文件格式请配置 loader 和增加[ts 定义](src/shims-modules.d.ts))
- 在 `scss` 中引入 `css` ([@import](https://www.sass.hk/docs)) 有两种方式
  1. 【推荐】不带文件后缀, css 文件内容会被合并到当前文件。比如: `@import '~normalize.css';`
  1. 带文件后缀, 会处理成 css 的[@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)。比如: `@import '~normalize.css/normalize.css';`

### 其他

- 期待 [vue3.0](https://github.com/vuejs/vue/projects/6) & [vue cli 4.0](https://github.com/vuejs/vue-cli/projects/7) 正式版 & [webpack 5.0](https://github.com/webpack/webpack/projects/5) [正式版](https://github.com/webpack/changelog-v5/blob/master/README.md)
- [#714](https://github.com/webpack-contrib/sass-loader/issues/714): 可追踪引用，使在 js 中引用 scss 时可正确<a href="#全局scss">注入 scss 变量</a>
