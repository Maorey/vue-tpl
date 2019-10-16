/*
 * @description: 开发环境配置
 * @Author: Maorey
 * @Date: 2019-04-01 13:15:59
 */
// const COUNTER = {} // 重命名计数器
// const REG_GLOBAL_VUE = /^([^\\/]+\.)(vue|tsx|jsx)$/ // 是否无路径vue组件

// 开发环境配置
/** webpack 配置
 * @param {chainWebpack} config 配置对象
 *  https://github.com/neutrinojs/webpack-chain#getting-started
 */
module.exports = function(config) {
  // eval 更快(默认cheap-module-eval-source-map), 且无同名.vue文件sourceMap冲突
  // 反正<template><style>也不能调试不是）(TypeScript 有 sourceMap)
  config.devtool('eval')
  config.output.devtoolModuleFilenameTemplate(
    'webpack://[namespace]/[resource-path]'
  )
  /// 避免同名.vue文件sourceMap冲突 ///
  // https://webpack.js.org/configuration/output/#outputdevtoolmodulefilenametemplate
  // config.output.devtoolFallbackModuleFilenameTemplate(
  //   'webpack://[namespace]/[resource-path]'
  // )
  // config.output.devtoolModuleFilenameTemplate(info => {
  //   let fileName = info.resourcePath // 最终文件名(带相对路径)
  //   const match = REG_GLOBAL_VUE.exec(fileName) // 匹配

  //   if (match) {
  //     if (COUNTER[fileName]) {
  //       // 重名
  //       fileName = match[1] + COUNTER[fileName]++ + '.' + match[2]
  //     } else {
  //       COUNTER[fileName] = 1
  //     }

  //     return `vue-sources://${info.namespace}/${fileName}`
  //   }

  //   return `webpack://${info.namespace}/${fileName}`
  // })

  /// 插件 ///
  // html-webpack-plugin
  // 想要直接放到body后html前啊... inject: false、'head'、true(='body')
  // 可以插入到head，用script-ext-html-webpack-plugin指定script defer
  // config.plugin('html-main').tap(() => [{ inject: 'head' }])
  // config.plugin('script-ext').use('script-ext-html-webpack-plugin', [
  //   {
  //     defaultAttribute: 'defer',
  //   },
  // ])
  // 补全html插入资源
  config
    .plugin('insert-preload')
    .use(require('path').join(process.cwd(), 'build/insertPreload.js'))
  // stylelint
  config.plugin('stylelint').use('stylelint-webpack-plugin', [
    {
      fix: true,
      cache: true,
      lintDirtyModulesOnly: true,
      files: ['**/*.vue', '**/*.scss', '**/*.css'],
      cacheLocation: 'node_modules/.cache/stylelint/',
    },
  ])
}
