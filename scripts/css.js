/*
 * @Description: 样式选项
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:11:02
 */
const fs = require('fs')
const path = require('path')
const loaderUtils = require('loader-utils')

const cache = {}
const exists = (key, rootDir, fileName) => {
  let result = cache[key]
  if (result === undefined) {
    fileName = path.join(rootDir, fileName)
    result = cache[key] =
      fs.existsSync(fileName) ||
      fs.existsSync(path.join(fileName, 'index.scss'))
    setTimeout(() => (cache[key] = undefined), 20000)
  }

  return result
}

/** 获取样式选项
 * @param {Boolean} isProd 是否生产环境
 * @param {Object} ALIAS 别名字典
 * @param {Object} ENV 环境变量
 */
module.exports = (isProd, ALIAS, ENV) => {
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
        sassOptions: { fiber: require('fibers') },
        // 全局scss变量(入口覆盖全局 https://webpack.js.org/api/loaders)
        prependData(loaderContext) {
          let content = ''

          // 注入scss变量
          const vars = loaderUtils.parseQuery(loaderContext.resourceQuery).var
          if (vars) {
            content = `@import "~@/${vars}";`
            let temp
            let alias
            for (alias in ALIAS) {
              temp = ALIAS[alias]
              loaderContext.context.includes(temp) &&
                exists(alias, temp, vars) &&
                (content += `@import "~${alias}/${vars}";`)
            }
          }

          return content
        },
      },
    },
  }
}
