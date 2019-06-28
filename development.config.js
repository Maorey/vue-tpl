/*
 * @description: 开发环境配置
 * @Author: Maorey
 * @LastEditors: 毛瑞
 * @Date: 2019-04-01 13:15:59
 * @LastEditTime: 2019-06-26 16:52:43
 */
const FIGURE = require('./figure') // 输出图形

const COUNTER = {} // 重命名计数器
const REG_GLOBAL_VUE = /^([^\\/]+\.)vue$/ // 是否无路径vue文件

// 开发环境配置
/** webpack 配置
 * @param {chainWebpack} config 配置对象
 *  https://github.com/neutrinojs/webpack-chain#getting-started
 */
module.exports = function(config) {
  /// 避免sourceMap冲突 ///
  // 冲突原因:*.vue文件被放sourceMap全局下，无法通过文件名/hash区分不同位置的同名vue文件
  // 没法设置*.vue文件(模块)hash方式 默认用文件名计算,咋不带路径...
  // config.module
  //   .rule('vue')
  //   .use('vue-loader')
  //   .tap(options => {
  //     options.name = options.filename = options.chunkFilename =
  //       'js/[name].[contenthash:3].js'
  //     options.hash = '[contenthash:3]'

  //     return options
  //   })
  // https://webpack.js.org/configuration/output/#outputdevtoolmodulefilenametemplate
  // webpackConfig.devtool值: sourceMap值
  //                    eval: webpack://[namespace]/[resource-path]?[loaders]
  //     [inline-]source-map: webpack://[namespace]/[resource-path]
  //         eval-source-map: webpack://[namespace]/[resource-path]?[hash]
  // 当前(@vue/cli):cheap-module-eval-source-map
  config.output.devtoolFallbackModuleFilenameTemplate(
    'webpack://[namespace]/[resource-path]'
  )
  config.output.devtoolModuleFilenameTemplate(info => {
    let fileName = info.resourcePath // 最终文件名(带相对路径)
    const match = REG_GLOBAL_VUE.exec(fileName) // 匹配

    if (match) {
      if (COUNTER[fileName]) {
        // 重名
        fileName = match[1] + COUNTER[fileName]++ + '.vue'
      } else {
        COUNTER[fileName] = 1
      }

      return `vue-sources://${info.namespace}/${fileName}`
    }

    return `webpack://${info.namespace}/${fileName}`
  })

  /// 插件 ///
  /// html-webpack-plugin ///
  // 想要直接放到body后html前啊... inject: false、'head'、true(='body')
  // 可以插入到head，用script-ext-html-webpack-plugin指定script defer
  // config.plugin('html-main').tap(() => [{ inject: 'head' }])
  // config.plugin('script-ext').use('script-ext-html-webpack-plugin', [
  //   {
  //     defaultAttribute: 'defer',
  //   },
  // ])

  console.log(FIGURE['d' + Math.ceil(Math.random() * 5)]) // 输出图形
}
