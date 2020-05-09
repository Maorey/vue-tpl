/**
 * @Description: 工程(vue cli)配置入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 16:18:18
 */
const ENV = process.env // 环境变量
const isProd = ENV.NODE_ENV === 'production' // 是否生产环境
const pages = require('./build/pages')(isProd) // 自动检测并返回页面入口设置

const ALIAS = {} // 别名字典
// 输出图形
const FIGURE = require('./build/figure')
// eslint-disable-next-line no-console
console.log(
  '\033[3' + // eslint-disable-line no-octal-escape
    Math.ceil(Math.random() * 6) +
    'm' +
    FIGURE[(Math.random() * FIGURE.length) | 0] +
    '\33[0m' // eslint-disable-line no-octal-escape
)

/// 【配置项】https://cli.vuejs.org/zh/config ///
module.exports = {
  /// 普通 ///
  publicPath: ENV.BASE_URL, // 发布路径
  lintOnSave: !isProd, // 保存时检查代码
  productionSourceMap: false, // 生产环境不要sourceMap
  // babel转码, 默认不转依赖包
  // transpileDependencies: isProd ? ['vuex-module-decorators'] : undefined,

  /// 【配置页面入口】https://cli.vuejs.org/zh/config/#pages ///
  pages,

  /// 【配置样式】 ///
  css: require('./build/css')(isProd, ALIAS, ENV),

  /// 【开发服务器配置】 ///
  devServer: require('./build/devServer')(ENV),

  /// 【webpack配置】 ///
  // https://github.com/neutrinojs/webpack-chain#getting-started
  chainWebpack(config) {
    config.cache(true) // 使用缓存
    let env // 工具人
    /// 设置目录别名 已有: @ => src ///
    try {
      env = JSON.parse(ENV._ROUTES)
    } catch (error) {}
    require('./build/alias')(pages, config, ALIAS, env)

    /// 环境变量 ///
    env = {}
    const prefix = 'process.env.' // 工具人二号
    const REG_ENV = /^[A-Z]+(?:_[A-Z]+)?$/
    for (const att in ENV) {
      REG_ENV.test(att) && (env[prefix + att] = JSON.stringify(ENV[att]))
    }
    config.plugin('define').use(require('webpack').DefinePlugin, [env])

    /// 不处理的依赖库 ///
    // 在html模板引入了会创建全局变量的js后可以设置以在src中使用这个全局变量
    // config.externals({
    //   global: 'global',
    // })

    /// web workers 支持 ///
    config.module
      .rule('web workers')
      .merge(config.module.rule('ts').toConfig()) // 需要 ts allowJs
      .test(/(?:\.worker|[\\/]workers[\\/]\w+)\.[tj]s$/)
      .use('worker-loader')
      .loader('worker-loader')
      .options({
        name: 'js/[name].[hash:3].worker.js',
        fallback: true,
        publicPath: ENV.BASE_URL,
      })
      .after('0') // merge名字变数组索引了

    /// 【不同环境配置】 ///
    require(isProd
      ? './build/production.config'
      : './build/development.config')(config, ENV, pages)
  },
}
