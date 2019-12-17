/*
 * @Description: 样式选项
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:11:02
 */
const fiber = require('fibers')
const skinLoader = require('./skinLoader')

/** 获取样式选项
 * @param {Boolean} isProd 是否生产环境
 * @param {Object} ALIAS 别名字典
 * @param {Object} ENV 环境变量
 */
module.exports = function(isProd, ALIAS, ENV) {
  skinLoader.init(ENV)

  // https://cli.vuejs.org/zh/config/#css-loaderoptions
  return {
    requireModuleExtension: true,
    loaderOptions: {
      // https://github.com/webpack-contrib/css-loader
      css: {
        modules: {
          // https://github.com/webpack/loader-utils#interpolatename
          localIdentName: isProd
            ? '[contenthash:5]'
            : '[folder]__[name]_[local]-[emoji]$',
        },
        localsConvention: 'camelCaseOnly', // 只允许驼峰class名
      },
      // https://github.com/webpack-contrib/sass-loader
      scss: {
        sassOptions: { fiber },
        // 全局scss变量(入口覆盖全局 https://webpack.js.org/api/loaders)
        prependData(loaderContext) {
          let content = ''

          // 注入scss变量
          const SKIN = skinLoader.getSkinByQuery(loaderContext.resourceQuery)
          if (SKIN) {
            content = `@import "~@/${SKIN.path}";`
            let temp
            for (const alias in ALIAS) {
              temp = ALIAS[alias]
              loaderContext.context.includes(temp) &&
                (temp = skinLoader.exists(temp, SKIN.path)) &&
                (content += `@import "~${alias}/${temp}";`)
            }
          }

          return content
        },
      },
    },
  }
}
