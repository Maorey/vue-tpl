/*
 * @Description: 样式选项
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:11:02
 */
const fs = require('fs')
const path = require('path')

const CACHE = {}
function exists(key, rootDir, fileName) {
  let result = CACHE[key]
  if (result === undefined) {
    fileName = path.join(rootDir, fileName)
    result = CACHE[key] = fs.existsSync(fileName)
    setTimeout(() => (CACHE[key] = undefined), 20000)
  }

  return result
}
const REG_THEME = /&?theme=(.*?)!(.*?)&?/
function getTheme(query) {
  query = REG_THEME.exec(query)
  return query && (query = { name: query[1], path: query[2] })
}

/** 获取样式选项
 * @param {Boolean} isProd 是否生产环境
 * @param {Object} ALIAS 别名字典
 * @param {Object} ENV 环境变量
 */
module.exports = function(isProd, ALIAS, ENV) {
  const context = path.join(process.cwd(), 'src')
  const THEME_DIR = ENV.THEME_DIR
  const themeDir = path.join(context, THEME_DIR)
  const index = '/index.scss'
  const DEFAULT = 'default'
  const THEME = ENV.THEME

  let defaultPath = { name: DEFAULT, path: ENV.GLOBAL_SCSS } // 默认全局scss变量
  let file
  fs.existsSync(path.join(context, defaultPath.path)) ||
  fs.existsSync(path.join(context, (defaultPath.path += index)))
    ? THEME &&
      THEME !== DEFAULT &&
      (fs.existsSync(path.join(themeDir, (file = `${THEME}.scss`))) ||
        fs.existsSync(path.join(themeDir, (file = THEME + index)))) &&
      (defaultPath = { name: THEME, path: `${THEME_DIR}/${file}` })
    : (defaultPath = 0)

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
          let theme = getTheme(loaderContext.resourceQuery) || defaultPath
          if (theme) {
            content = `@import "~@/${(theme = theme.path)}";`
            let temp
            let alias
            for (alias in ALIAS) {
              temp = ALIAS[alias]
              loaderContext.context.includes(temp) &&
                exists(alias, temp, theme) &&
                (content += `@import "~${alias}/${theme}";`)
            }
          }

          return content
        },
      },
    },
  }
}
