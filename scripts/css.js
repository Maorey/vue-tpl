/*
 * @Description: 样式选项
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:11:02
 */
const fs = require('fs')
const path = require('path')

/** 模块是否被指定入口路径引用
 * @param {WebpackModule} module webpack模块
 * @param {string} entry 入口路径
 *
 * @returns {Boolean}
 */
function includes(module, entry) {
  return (
    !!module &&
    (module.context.includes(entry) || includes(module.issuer, entry))
  )
}

/** 获取样式选项
 * @param {Boolean} isProd 是否生产环境
 * @param {Object} pages 页面入口配置
 * @param {String} globalSCSS 全局scss相对路径
 */
module.exports = function(isProd, pages, globalSCSS) {
  return {
    // https://cli.vuejs.org/zh/config/#css-loaderoptions
    loaderOptions: {
      css: {
        modules: {
          // class名 内容哈希5个字符足够（数字开头的会自动补个下划线）
          // https://github.com/webpack-contrib/css-loader#localidentname
          // https://github.com/webpack/loader-utils#interpolatename
          localIdentName: isProd
            ? '[hash:5]'
            : '[folder]-[name]-[local][emoji]',
        },
        localsConvention: 'camelCaseOnly', // 只允许驼峰class名
      },
      sass: {
        // 全局scss变量(入口覆盖全局)
        data({ _module }) {
          // More information about avalaible options https://webpack.js.org/api/loaders/
          let global = `@import "@${globalSCSS}";` // 项目全局

          let temp
          let key
          for (key in pages) {
            if (
              includes(_module, (temp = pages[key].alias)) &&
              fs.existsSync(path.join(temp, globalSCSS))
            ) {
              global += `@import "@${key + globalSCSS}";`
              break
            }
          }

          return global
        },
      },
    },
  }
}
