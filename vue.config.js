/**
 * @Description: 工程(vue cli)配置入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 16:18:18
 */

// TODO: 环境变量/入口文件 改变热更新

const path = require('path')

const environment = process.env // 环境变量
const isProd = environment.NODE_ENV === 'production' // 是否生产环境

const pages = require('./scripts/pages')(isProd) // 自动检测并返回页面入口设置

const ALIAS = {} // 别名字典
// 输出图形
// eslint-disable-next-line no-console
console.log(
  // eslint-disable-next-line no-octal-escape
  (isProd ? '\033[32m' : '\033[35m') +
    // eslint-disable-next-line standard/computed-property-even-spacing
    require('./scripts/figure')[
      isProd
        ? 'd' + Math.ceil(Math.random() * 5)
        : 'p' + Math.ceil(Math.random() * 10)
    ] +
    // eslint-disable-next-line no-octal-escape
    '\33[0m'
)

/// 【配置项】https://cli.vuejs.org/zh/config ///
module.exports = {
  /// 普通 ///
  publicPath: './', // 发布路径（./: 相对路径）
  lintOnSave: !isProd, // 保存时检查代码
  productionSourceMap: false, // 生产环境不要sourceMap
  // babel转码, 默认不转依赖包
  transpileDependencies: isProd ? ['vuex-module-decorators'] : undefined,

  /// 【配置页面入口】https://cli.vuejs.org/zh/config/#pages ///
  pages,

  /// 【配置样式】 ///
  css: require('./scripts/css')(isProd, ALIAS, environment.GLOBAL_SCSS),

  /// 【开发服务器配置】 ///
  devServer: require('./scripts/devServer')(environment),

  /// 【webpack配置】 ///
  // https://github.com/neutrinojs/webpack-chain#getting-started
  chainWebpack(config) {
    /// 【设置目录别名 已有: @ => src 】 ///
    require('./scripts/alias')(pages, config, ALIAS)

    /// 不处理的依赖库 ///
    // 在html模板引入了会创建全局变量的js后可以设置以在src中使用这个全局变量
    // config.externals({
    //   global: 'global',
    // })

    /// 插件 ///
    // 补全html插入资源
    config
      .plugin('insert-preload')
      .use(path.resolve('./scripts/insertPreload.js'))

    /// 【不同环境配置】 ///
    require(isProd
      ? './scripts/production.config'
      : './scripts/development.config')(config)
  },
}
