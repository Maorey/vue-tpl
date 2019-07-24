# vue-tpl

vue + vuex + vue router + TypeScript(支持 JavaScript) 脚手架

[更新日志](releaseLog.md)

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

同时会生成`build/fileName.map`记录 文件名/chunk 名映射 (公共代码抽到`v.`开头的文件里了)

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

tips:

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
      1. 若该目录下存在与该 html 模板名同名的 ts/tsx/js/jsx 文件则设置为入口，未找到或已占用则 2
      2. 依次检查下列文件名: main/index/entry/app/page 设置为入口，未找到或已占用则 3
      3. 在该目录下与 html 模板同名的目录下按照 1、2 的规则继续查找，最终仍未找到或已占用则不设置入口

   建议：**单页入口直接放 src 目录下，多页时入口分别放在 pages 目录下与 html 模板同名的文件夹下**

2. 已有目录别名如下:

   - `@` -> `src`
   - `@com` -> `src/components`
   - `@{entry}` -> 页面入口文件所在目录，如: `@index`
   - `@{entry}Com` -> 页面入口文件所在目录下的 `components` 目录，如: `@indexCom`

   **Tips**: 在 `scss` 中使用 `~` 解析 `别名`/`依赖包` 对应目录。 示例:

   ```html
   <!-- SomeView.vue -->
   <template>
     <div :class="$style.wrapper">
       <!-- 视为ts/js alias: @ -->
       <img src="@/assets/logo.png" />
     </div>
   </template>

   <style lang="scss" module>
     // package normalize.css: node_modules/normalize.css/normalize.css
     @import '~normalize.css';

     .wrapper {
       background: url(~@index/assets/bg.png); // alias: @index
     }
   </style>
   ```

3. 输出目录为 `dist`, 包含 js/css/img/font/media 等文件夹
4. 所有 `config` 目录下的内容都会被打包到同一个文件`conf.*.js`(需要保留的注释请使用: `/*! 注释内容 */`)，用于支持直接修改配置文件不必重新打包代码
5. 除了以下样式:

   - 浏览器默认样式重置
   - Transition 动画样式
   - 字体图标样式
   - 公共组件样式(使用[BEM ](https://en.bem.info)约定[参考链接](https://www.ibm.com/developerworks/cn/web/1512_chengfu_bem/))
   - 少量全局样式【慎用】

   均应使用 [CSSModule](https://vue-loader-v14.vuejs.org/zh-cn/features/css-modules.html)，以更好的组件化和复用、打包样式

6. 测试用例目录层级与文件名应尽量与源码对应

> **提示和建议**

- 新建目录时尽量复用上述列出的目录名，保证结构清晰的情况下减少目录层级
- 目录及文件命名：<br>
  **文件夹及其它文件**(js/scss/图片等)使用 `camelCase` (即：首字母小写驼峰 = lowerCamelCase)；<br>
  **vue 单文件组件**(含[tsx](https://github.com/wonderful-panda/vue-tsx-support)/`jsx`/`functional .(ts|js)`)使用 `PascalCase` ( 即：首字母大写驼峰 = CamelCase = UpperCamelCase)<br><br>
  例外情况:

  - 组件包含不可复用的子组件时，应视为一个组件, 创建**文件夹容器**，比如:

    ```TypeScript
    // BillList组件
    BillList
    │── index.tsx
    │── Item.vue
    └── ...

    // 使用组件
    import BillList from '{path}/BillList'
    ```

    或者 ([node](https://nodejs.org/api/modules.html)/[ts](https://www.tslang.cn/docs/handbook/module-resolution.html)模块解析无法添加扩展名 ╮(╯▽╰)╭)

    ```TypeScript
    // BillList组件
    BillList
    │── index.vue # 可以例外
    │── Item.vue
    └── ...

    // 使用组件
    import BillList from '{path}/BillList/index.vue'
    ```

- 视图只负责布局及交互(props 传递和事件监听)，包含子组件的可使用**文件夹容器**方式或将子组件存放在对应层级的 `components` 目录下的同名目录(`camelCase`)下
- 公共组件/逻辑/函数/样式等模块请按照: `模块 -> 视图 -> 页面 -> 项目` 的层级提升, 配合**提前规划**确定初始层级
- 越高的层级测试覆盖率也应越高; 被测试的代码应加注释`@test: true`表示在对应目录下包含测试用例,否则指明路径; 修改了测试覆盖的代码后，应视情况增加测试内容并运行测试，以保证功能和行为与之前一致
- 尽量**不要使用全局注册**(插件/组件/指令/混入等)以优化打包和使代码更清晰、易维护
- 组件尽量**按逻辑和呈现拆分**以更好的复用和维护
- 尽量**按照依赖库的文档描述**使用，从其源码(src)引入模块，将可能**不会被转译**且更可能随版本更新改变，可以从其构建后的 lib/dist 等目录引入模块

### 风格建议

推荐使用 [TypeScript](https://www.tslang.cn)

- CSS Modules class 名使用 `camelCase` (global 可以 kebab-case), 选择器嵌套**不应超过三层**
- JavaScript 代码风格为 [**JavaScript standard**](https://standardjs.com/rules-zhcn.html)，除了以下区别:

  - 使用单引号
  - 不要句尾分号
  - 多行末尾保留逗号
  - 方法名后不要空格

  （.vscode 文件夹为 VSCode 的工作区设置，只在本项目生效，已包含 Prettier 插件相关风格设置）

- 另请参考: [vue 风格指南](https://cn.vuejs.org/v2/style-guide/) **推荐(C)及以上**和 TypeScript [tslint.json](https://palantir.github.io/tslint/rules/)

- 提交代码请使用标识: Add/Del/Fix/Mod 等
- 先定义再`export`(IDE 提示更友好), 并且`export`语句放到最后(方便查看代码)
- **不要用全局样式覆盖全局样式**, 应使用 `CSSModule` 并使优先级相等(注意顺序，包括同步/异步)或更高:
  ```scss
  // bad →_→
  :global {
    .content .title.active {
      color: $colorHighlight;
    }
  }
  // good ｂ(￣▽￣)ｄ
  .content {
    :global {
      .title.active {
        color: $colorHighlight;
      }
    }
  }
  ```
- 尽量使用项目代码模板，现有模板有(vsCode 输入左侧字符, [其他 IDE](.vscode/vue.code-snippets)):
  - `ts`: `TypeScript` & `CSS Module`, vue 单文件组件中使用
  - `vue`: `TypeScript` & `CSS Module`, `tsx` 文件中使用
  - `js`: `JavaScript` & `CSS Module`, vue 单文件组件中使用
  - `vue`: `JavaScript` & `CSS Module`, `jsx` 文件中使用

### 其他建议

- 全局 sccs 中(见 .env 文件`GLOBAL_SCSS=/scss/var.scss`)不要出现具体样式, 最好也不要有[`:export{}`](https://github.com/css-modules/icss#export)

- 规范优雅正确适当的各种**注释**，比如方法注释及必要的变量注释：

  ```TypeScript
  // math.ts
  /** 点
   * @summary 描述一个点的信息
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
  const ANGLE_RADIAN: number = Math.PI / 180
  /** 计算圆上的点
   *
   * @param {IPoint} center 圆心
   * @param {Number} radius 半径
   * @param {Number} angle 角度
   *
   * @returns {IPoint} 圆上的点坐标
   */
  function getPointOnCircle(center: IPoint, radius: number, angle: number): IPoint {
    const redian: number = angle * ANGLE_RADIAN // 弧度

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

  // 使用枚举或字典时可视情况不写注释
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
      // 说明
  }
  ```

- [异步 chunk](https://webpack.docschina.org/api/module-methods) 使用入口层级命名(避免重名合并, 方便排查问题)，比如: index 页面下的 home 视图命名为 `index_home`, 其下的用户视图命名为 `index_home_my`, 用户基础信息命名为 `index_home_my_baseinfo` 。为避免文件名太长，每个层级可以用一到两个字母进行缩写: `iHome`, `ihMy`, `ihmBaseInfo`。
- libs 下库文件需要按需加载的，应提供引入方法（只会成功加载一次），比如:

  ```TypeScript
  // src/libs/somelib/index.ts
  /** 异步引入somelib及其插件
   * @param {Array<String>} plugins 需要加载的somelib插件名列表
   *
   * @returns {Promise<Array<Module>>}
   */
  function get(plugins: string[] = []): Promise<any> {
    return import(/* webpackChunkName: "lSomelib" */ 'somelib').then(() =>
      Promise.all(
        plugins.map((plugin: string) => {
          switch (plugin) {
            case 'plugin1':
              return import(
                /* webpackChunkName: "lsPlugins" */ 'somelib.plugin1'
              )
            case 'plugin2':
              return import(
                /* webpackChunkName: "lsPlugins" */ 'somelib.plugin2'
              )
            // 上面两个插件合并到一个chunk里
          }
        })
      )
    )
  }

  export default get
  ```

### 优化

请参照 `vue.config.js` 文件中 _chainWebpack_ 的注释进行配置

- 减小图片大小(比如背景图片等)
- 对多个 js chunk 共同依赖的模块进行单独提取(cacheGroups)
- 视情况对 css 文件进行合并(比如按入口等，不设置则按 chunk)
- [现代模式](https://cli.vuejs.org/zh/guide/browser-compatibility.html#现代模式)

### IDE

推荐使用： **Visual Studio Code** (VSCode)，推荐插件：

- Vetur: vue 开发必备
- ESLint & TSLint: 代码检查
- Prettier - Code formatter: 代码格式化
- GitLens: Git 工具
- EditorConfig for VS Code: IDE 设置

推荐工具： [`@vue/cli`](https://cli.vuejs.org/zh/guide)，全局安装时可使用 `vue ui` 命令启动图形化界面管理项目

## 部署（nginx）

简记如下，有待运维大佬进一步优化

1. url 重写兼容旧版
2. 反向代理，绕过同源策略限制（api/图片等资源跨域等）
3. 添加请求头字段 `access_token` 使后台能读到该字段（nginx 的 http 或 server 节点下需要添加配置`underscores_in_headers on; # 允许带下划线的请求头`）
4. 开启 `gzip` 压缩，并重用已有 gz 文件 `gzip_static on;`
5. 缓存**除 html**之外其他静态资源

配置示例:

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
    # rewrite ^/app/(?:path|path-alias)/(.*)$ /app/$1 last; # 兼容某些路径
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
    try_files $uri $uri/  /; # 使支持history路由
    root {path};
  }

  # 部署在其他目录 访问域名/目录
  location /app {
    # 略

    index index.html;
    try_files $uri $uri/ /app/;
    alias {path};
  }


  # 接口代理
  location /api/ {
    proxy_pass http://{ip}:{port}/{path}/;
    # 缓存策略...
  }

}
```

### 备忘

#### 文档

- [scss](https://www.sass.hk/docs)
- [axios](https://github.com/axios/axios)
- [crypto-js](http://cryptojs.altervista.org)
- [jsencrypt](http://travistidwell.com/jsencrypt)
- [vue](https://cn.vuejs.org)
- [vuex](https://vuex.vuejs.org)
- [vue-router](https://router.vuejs.org)
- [vuex-class](https://github.com/ktsn/vuex-class)
- [vue-class-component](https://github.com/vuejs/vue-class-component)
- [vuex-module-decorators](https://championswimmer.in/vuex-module-decorators/)
- [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)
- [vue-i18n](http://kazupon.github.io/vue-i18n)

#### 问题及思考

- **Vue 异步组件加载失败重试**: 暂时无解，因各层级（RouterView functional 等）的分发，很难统一实现加载失败后可点击重新下载，最好还是 Vue 对异步组件提供支持[#9788](https://github.com/vuejs/vue/issues/9788)。
- 现代模式(只针对 js 文件): 该模式优点是若浏览器支持 ES2015 则加载 ES2015 代码(体积更小执行更快，`<script type="module">` & `<link rel="modulepreload">`)；不支持则加载 Babel 转码后的代码(`<script nomodule>` & `<link rel="preload">`)。但是不知何故未能生效，github 上有一些相关 issue。

#### 笔记

- 在 `ts/js` 中使用 `assets` 目录下的图片可以通过 `require('@/assets/img/*.png')`, 将得到输出路径或 base64 字符串, 其他类似(新的文件格式请配置 loader 和增加[ts 定义](src/shims-modules.d.ts))
- 在 `scss` 中引入 `css` ([@import](https://www.sass.hk/docs)) 有两种方式
  1. 【推荐】不带文件后缀, css 文件内容会被合并到当前文件。比如: `@import '~normalize.css';`
  1. 带文件后缀, 会处理成 css 的[@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)。比如: `@import '~normalize.css/normalize.css';`
- `TypeScript` 中 `for in` 一个对象 obj 可以申明接口或者:

  ```TypeScript
  const temp: any = obj
  let key: string
  for(key of temp) {
    temp[key]
  }
  ```

#### 其他

- 期待 [vue3.0](https://github.com/vuejs/vue/projects/6) & [vue cli 4.0](https://github.com/vuejs/vue-cli/projects/7) 正式版 & [webpack 5.0](https://github.com/webpack/webpack/projects/5) [正式版](https://github.com/webpack/changelog-v5/blob/master/README.md)
- css-loader 得用 2.1.1，@vue/cli issue[#4337](https://github.com/vuejs/vue-cli/issues/4337)
