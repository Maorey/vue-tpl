/*
 * @Description: 样式选项
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:11:02
 */
const fs = require('fs')
const path = require('path')
const REG_EXCLUDE = /[\\/]node_modules[\\/]/

const cache = {}
function exists(key, rootDir, fileName) {
  let result = cache[key]
  if (result === undefined) {
    result = cache[key] = fs.existsSync(path.join(rootDir, fileName))
    setTimeout(() => (cache[key] = undefined), 20000)
  }

  return result
}

function includes(module, entry) {
  return (
    !!module &&
    (module.context.includes(entry) || includes(module.issuer, entry))
  )
}

/** 获取样式选项
 * @param {Boolean} isProd 是否生产环境
 * @param {Object} pages 页面入口配置
 * @param {String} resource 全局scss文件相对路径
 */
module.exports = function(isProd, pages, resource) {
  // https://cli.vuejs.org/zh/config/#css-loaderoptions
  return {
    requireModuleExtension: true,
    loaderOptions: {
      // https://github.com/webpack-contrib/css-loader
      css: {
        modules: {
          // https://github.com/webpack/loader-utils#interpolatename
          localIdentName: isProd ? '[hash:5]' : '[folder]-[name]-[local]',
        },
        localsConvention: 'camelCaseOnly', // 只允许驼峰class名
      },
      // https://github.com/webpack-contrib/sass-loader
      scss: {
        // 全局scss变量(入口覆盖全局或node_modules)
        data({ _module }) {
          const isExclude = REG_EXCLUDE.test(_module.context)
          const scssVar = `@import "@${resource}";`

          let scss = isExclude ? '' : scssVar

          // 入口scss变量 https://webpack.js.org/api/loaders
          let key
          let alias
          for (key in pages) {
            // production 时 module.issuer=null 没法知道入口 ┐(：´ゞ｀)┌
            alias = pages[key].alias
            if (
              (isExclude || includes(_module, alias)) &&
              exists(key, alias, resource)
            ) {
              scss += `@import "@${key + resource}";`

              if (!isExclude) {
                break
              }
            }
          }

          return (isExclude && scss ? scssVar : '') + scss
        },
      },
    },
  }
}
