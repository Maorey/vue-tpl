# 更新日志

## v 1.2.15

- 指定入口
- 指定别名
- 动态指定调试参数

## v 1.2.14

- enum重命名为enums
- utils
- 升级依赖

## v 1.2.13

- 路由缓存配置相关
- 升级依赖

## v 1.2.12

- WebSocket简单包装类
- 完善utils

## v 1.2.10

- banner插件
- 工具函数优化
- 文件/图片下载内存管理

## v 1.2.9

- 修复异步css chunk包含不定数量(皮肤/默认)文件问题等
- 异步选择器(ChooserAsyncFunctional/ChooserAsync)active状态处理等

## v 1.2.8

- 重用本地chunk名字典等

## v 1.2.7

- 优化路由、缓存及刷新策略
- 文件管理相关(进行中)

## v 1.2.5

- 完善嵌套路由刷新

## v 1.2.0

- 路由缓存优化
- 对话框默认可拖拽

## v 1.1.0

- 细节细节还是细节

## v 1.0.0

- [Breaking] 重命名主题(theme)为皮肤(skin)，并调整相关环境变量及目录、文件名

## v 0.3.0

- 支持换肤

## v 0.2.0

- 升级到 @vue/cli 4.1.1
- 工具库目录结构
- 增强代码检查 ESLint & StyleLint
- 支持内联多个 chunk 到 html (修改自[inline-manifest-webpack-plugin](https://github.com/szrenwei/inline-manifest-webpack-plugin))
- 使用[hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)优化构建速度
- 完善 skinLoader

## v 0.1.0

- 初始化 @vue/cli 4 项目
- 增加项目优化设置
- 代码风格设置
- 自动设置入口
- 自动设置代理
- 文档
- 增加 utils 和对应单元测试
- 支持入口级别的全局 scss 变量(入口的覆盖 src 的)
- 增加 vue-ts/vue-js/tsx/jsx 代码模板
- 配置 vscode 调试
- index 页大屏示例
- element-ui 模块化 全局/局部 注册示例
- js 图形库模块化引入示例
- 路由加载进度条 & 局部刷新路由
