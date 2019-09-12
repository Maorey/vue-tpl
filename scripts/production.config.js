/*
 * @description: 生产环境配置
 * @Author: 毛瑞
 * @Date: 2019-04-01 13:28:06
 */

/** 获取配置对象
 * @param {String} name 文件名
 *
 * @returns {Object} loader 配置对象
 */
const getLoaderOption = name => ({
  limit: 4096,
  fallback: {
    loader: 'file-loader',
    options: {
      name,
    },
  },
})

/** webpack 配置
 * @param {chainWebpack} config 配置对象
 *  https://github.com/neutrinojs/webpack-chain#getting-started
 */
module.exports = config => {
  config.merge({
    // https://webpack.js.org/configuration/other-options/#recordspath
    recordsPath: require('path').resolve('scripts/records.json'),
  })
  /// 构建优化(vue cli 大法好) ///
  // 已使用 cache-loader
  // minimizing 已开启多线程
  // parallel-webpack或happypack loader不同线程插件不适用
  /// loader不同线程 【cli已判断cpu核心数开启】 ///
  // const threadLoader = require('thread-loader')
  // warm不了,loader从package.json读...
  // threadLoader.warmup({}, ['eslint-loader', 'sass-loader'])
  // const threadLoader = 'thread-loader'
  // // eslint
  // config.module
  //   .rule('eslint')
  //   .oneOf(threadLoader)
  //   .use(threadLoader)
  //   .loader(threadLoader)
  //   .end()
  //   .oneOf('eslint-loader')
  //   .use('eslint-loader')
  //   .after(threadLoader)
  // // sass
  // // babel

  /// 文件名 ///
  // js chunkFilename只能是String...这个hash就缩不短了啊
  const jsFileName = 'js/[name].[chunkhash:3].js'
  config.output.filename(jsFileName).chunkFilename(jsFileName)
  // css filename/chunkFilename只能String
  const cssFileName = 'css/[name].[contenthash:3].css'
  config
    .plugin('extract-css')
    .tap(() => [{ filename: cssFileName, chunkFilename: cssFileName }])

  const FileName = '[name].[hash:3].[ext]'
  // 字体
  config.module
    .rule('fonts')
    .use('url-loader')
    .options(getLoaderOption('font/' + FileName))
  // svg
  config.module
    .rule('svg')
    .use('file-loader')
    .options({ name: 'img/' + FileName })
  // 图片
  config.module
    .rule('images')
    .use('url-loader')
    .options(getLoaderOption('img/' + FileName))
  // 媒体
  config.module
    .rule('media')
    .use('url-loader')
    .options(getLoaderOption('media/' + FileName))

  /// 插件 ///
  // 【更新后已不需要】固定打包文件哈希, 避免相同代码打包出不同哈希（排除 boilerplate(runtime and manifest)等影响）【有点过时，但有效】
  // config.plugin('md5-hash').use('webpack-md5-hash')
  // 或者
  // config
  //   .plugin('hash-module')
  //   .use(require('webpack').HashedModuleIdsPlugin, [{ hashDigestLength: 5 }])

  // 文件 gzip 压缩 https://webpack.docschina.org/plugins/compression-webpack-plugin/
  config.plugin('gzip').use('compression-webpack-plugin', [
    {
      threshold: 10240, // 启用压缩的最小文件大小 10k
      minRatio: 0.7, // 最小压缩率
    },
  ])
  // commonJS tree-shaking 耗时且效果微弱
  // config.plugin('common-shake').use(require('webpack-common-shake').Plugin)
  // 移除 "use strict";
  config
    .plugin('remove-use-strict')
    .use('webpack-remove-strict-mode-plugin', [{
      // exclude: /a.js/, // 排除的文件
      extension: ['.*'], // 文件后缀
    }])
}
