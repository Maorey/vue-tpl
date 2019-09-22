/*
 * @description: 生产环境配置
 * @Author: 毛瑞
 * @Date: 2019-04-01 13:28:06
 */

const path = require('path')

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
    recordsPath: path.resolve('/records.json'),
  }) // 生成记录

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
  // 打包主题
  config
    .plugin('theme-scss-var')
    .use(path.resolve('scripts/themeScssVar.js'), [
      { dir: process.env.THEME_DIR },
    ])
  // 补全html插入资源
  config
    .plugin('insert-preload')
    .use(path.resolve('scripts/insertPreload.js'), [{ runtime: 'runtime' }])
  // runtime Chunk 内联到html
  config
    .plugin('inline-manifest')
    .use('inline-manifest-webpack-plugin', ['runtime'])
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
  config.plugin('remove-use-strict').use('webpack-remove-strict-mode-plugin', [
    {
      // exclude: /a.js/, // 排除的文件
      extension: ['.*'], // 文件后缀
    },
  ])

  /// 【优化(optimization)】 ///
  // https://webpack.docschina.org/configuration/optimization 默认就好
  config.optimization.runtimeChunk({ name: 'runtime' }) // 抽出来内联到html

  /// 【代码分割(optimization.splitChunks 不能config.merge({}))】 ///
  // https://webpack.docschina.org/plugins/split-chunks-plugin
  config.optimization.splitChunks({
    chunks: 'all', // 包含所有类型包（同步&异步 用insert-preload补齐依赖）

    // 分割优先级: maxInitialRequest/maxAsyncRequests < maxSize < minSize
    minSize: 134144, // 最小分包大小
    // webpack 5
    // minSize: {
    //   javascript: 134144, // 131k
    //   style: 216064, // 211k
    // },
    maxSize: 320512, // 最大分包大小（超过后尝试分出大于minSize的包）
    // maxSize: {
    //   javascript: 320512, // 313k
    //   style: 398336, // 389k
    // },
    // 超过maxSize分割命名 true:hash(长度8，不造哪儿改)[默认] false:路径
    // hidePathInfo: true, // 也没个文件名配置啊...
    minChunks: 3, // 某个chunk被超过该数量的chunk依赖时才拆分出来
    maxAsyncRequests: 6, // 最大异步代码请求数【http <= 1.1 浏览器同域名并发请求上限: 6】
    maxInitialRequests: 3, // 最大初始化时异步代码请求数

    automaticNameMaxLength: 15, // 分包文件名自动命名最大长度
    automaticNameDelimiter: '.', // 超过大小, 分包时文件名分隔符
    name: require('./rename'),
    cacheGroups: {
      /// 【 js 】 ///
      // 所有其他依赖的模块
      dll: {
        name: 'dll',
        chunks: 'all',
        priority: 6,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]/,
      },
      // polyfills
      plf: {
        name: 'plf',
        chunks: 'all',
        priority: 6,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]core-js(?:-pure)?[\\/]/,
      },
      // configs (每个页面分开应无必要)
      conf: {
        name: 'conf',
        chunks: 'all',
        enforce: true, // 确保会创建这个chunk (否则可能会根据splitChunks选项被合并/拆分)
        priority: 666,
        test: /[\\/]config[\\/]/,
      },
      // json文件 (-> json.*.*.js)
      // json: {
      //   name: 'json',
      //   chunks: 'all',
      //   enforce: true,
      //   priority: 668,
      //   test: /[\\/]?.+\.json(?:[^\w].*)?$/,
      // },
      // vue全搜集 (vue/vuex/vue-router...)
      vue: {
        name: 'vue',
        chunks: 'all',
        priority: 66,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]vue.*[\\/]/,
      },
      // elementUI (建议按需引入)
      eui: {
        name: 'eui',
        chunks: 'all',
        priority: 66,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]element-ui[\\/]/,
      },
      // d3.js
      d3: {
        name: 'd3',
        chunks: 'all',
        priority: 66,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]d3[\\/]/,
      },
      // zrender (二维绘图引擎)
      zrd: {
        name: 'zrd',
        chunks: 'all',
        priority: 66,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]zrender[\\/]/,
      },
      // echarts (依赖 zrender)
      ect: {
        name: 'ect',
        chunks: 'all',
        priority: 66,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]echarts[\\/]/,
      },
      // zdog
      zdg: {
        name: 'zdg',
        chunks: 'all',
        priority: 66,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]zdog[\\/]/,
      },
      // pixi.js
      pix: {
        name: 'pix',
        chunks: 'all',
        priority: 66,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]@pixi|pixi\.js(?:-legacy)?[\\/]/,
      },
      // three.js
      thr: {
        name: 'pix',
        chunks: 'all',
        priority: 66,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]three[\\/]/,
      },
      // luma.gl & math.gl
      lum: {
        name: 'lum',
        chunks: 'all',
        priority: 66,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/](?:@?luma|math)\.gl[\\/]/,
      },

      /// 【 css 】(多数情况下不需要，webpack 5可以去掉) ///
      // 提取各入口的 css 到单独文件(还抽了一个空数组的 [entryName].*.*.js 出来???)
      // ...(() => {
      //   /** 获取模块是否是指定入口的
      //    * @param {Object} module webpack module 对象
      //    * @param {String} name 入口名
      //    *
      //    * @returns {Boolean}
      //    */
      //   const isBelong = (module, name) =>
      //     module.name === name ||
      //     (!!module.issuer && isBelong(module.issuer, name))

      //   const TYPE = 'css/mini-extract'

      //   let css = {}
      //   let chunkName
      //   for (let entryName in pages) {
      //     chunkName = entryName + '_' // 多页时与入口名重了要报错

      //     css[chunkName] = {
      //       name: chunkName,
      //       // 异步chunk的css合并可能存在因加载顺序改变导致的样式优先级问题，
      //       // 但这绝大多数都是异步chunk里存在覆盖全局的样式的全局样式
      //       // 减少使用全局样式，用好CSSModule可以避免
      //       chunks: 'async', // 'initial'、'all'
      //       enforce: true,
      //       priority: 66,
      //       // https://github.com/webpack-contrib/mini-css-extract-plugin
      //       // test: module =>
      //       //   module.constructor.name === 'CssModule' &&
      //       //   isBelong(module, entryName),
      //       test: module =>
      //         module.type === TYPE && isBelong(module, entryName),
      //     }
      //   }

      //   return css
      // })(),
    },
  })

  /// 构建优化(vue cli 大法好) ///
  // 已使用 cache-loader
  // minimizing 已开启多线程
  // parallel-webpack或happypack loader不同线程插件不适用
  /// loader不同线程(cli已判断cpu核心数开启) ///
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
}
