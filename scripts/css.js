/*
 * @Description: 样式选项
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:11:02
 */
const fs = require('fs')
const path = require('path')

const cache = {}
const exists = (key, rootDir, fileName) => {
  let result = cache[key]
  if (result === undefined) {
    result = cache[key] = fs.existsSync(path.join(rootDir, fileName))
    setTimeout(() => (cache[key] = undefined), 20000)
  }

  return result
}

/** 获取样式选项
 * @param {Boolean} isProd 是否生产环境
 * @param {Object} ALIAS 别名字典
 * @param {String} resource 全局scss文件相对路径
 */
module.exports = (isProd, ALIAS, resource) => {
  // https://cli.vuejs.org/zh/config/#css-loaderoptions
  return {
    requireModuleExtension: true,
    loaderOptions: {
      // https://github.com/webpack-contrib/css-loader
      css: {
        modules: {
          // https://github.com/webpack/loader-utils#interpolatename
          localIdentName: isProd ? '[hash:5]' : '[folder]__[name]_[local]',
        },
        localsConvention: 'camelCaseOnly', // 只允许驼峰class名
      },
      // https://github.com/webpack-contrib/sass-loader
      scss: {
        sassOptions: {
          fiber: require('fibers'),
        },
        // 全局scss变量(入口覆盖全局或node_modules)
        prependData(loaderContext) {
          let scss = `@import "~@/${resource}";`

          // 别名scss变量 https://webpack.js.org/api/loaders
          let temp
          let alias
          for (alias in ALIAS) {
            temp = ALIAS[alias]

            loaderContext.context.includes(temp) &&
              exists(alias, temp, resource) &&
              (scss += `@import "~${alias}/${resource}";`)
          }

          return scss
        },
      },
    },
  }
}
