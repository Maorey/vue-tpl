/*
 * @Description: 样式选项
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:11:02
 */
const fs = require('fs')
const path = require('path')
const sassLoader = require('sass-loader')

const CACHE = {}
function exists(rootDir, fileName) {
  fileName = path.join(rootDir, fileName || '')
  rootDir = CACHE[fileName]
  if (rootDir === undefined) {
    rootDir = CACHE[fileName] = fs.existsSync(fileName)
    setTimeout(() => (CACHE[fileName] = undefined), 20000)
  }

  return rootDir
}
const REG_THEME = /(?:^\??|&)theme=([^|&]*)\|?([^&]*)/
function getThemeByQuery(query) {
  query = REG_THEME.exec(query)
  return query && { name: query[1], path: query[2] }
}

/** 获取样式选项
 * @param {Boolean} isProd 是否生产环境
 * @param {Object} ALIAS 别名字典
 * @param {Object} ENV 环境变量
 */
module.exports = function(isProd, ALIAS, ENV) {
  const EXTENSION = '.scss'
  const REG_SCSS = /\.scss$/
  const INDEX = '/index.scss'
  const REG_INDEX = /\/index\.scss$/
  const THEME_DIR_PATH = ENV.THEME_DIR
  const THEME_DIR = path.join(path.join(process.cwd(), 'src'), THEME_DIR_PATH)

  let THEMES
  let THEME
  if (THEME_DIR) {
    const THEME_NAME = ENV.THEME
    THEME = THEME_NAME &&
      (exists(THEME_DIR, (THEME = THEME_NAME + EXTENSION)) ||
        exists(THEME_DIR, (THEME = THEME_NAME + INDEX))) && {
      name: THEME_NAME,
      path: `${THEME_DIR_PATH}/${THEME}`,
    }
    if (!THEME) {
      // 单主题
      THEME = (exists(THEME_DIR + (THEME = EXTENSION)) ||
        exists(THEME_DIR + (THEME = INDEX))) && {
        path: THEME_DIR + THEME,
      }
    } else if (isProd) {
      // 构建多主题
      THEMES = {}
      THEMES[THEME.name] = THEME.path
      let file
      let name
      for (file of fs.readdirSync(THEME_DIR, { withFileTypes: true })) {
        file.isFile()
          ? THEME_NAME === (name = file.name.replace(REG_SCSS, '')) &&
            (file = 0)
          : (THEME_NAME !== (name = file.name) &&
              exists(THEME_DIR, (file.name += INDEX))) ||
            (file = 0)
        file && (THEMES[name] = `${THEME_DIR_PATH}/${file.name}`)
      }
    }
  }
  const hasPath = path => {
    if (THEMES) {
      let temp
      for (temp in THEMES) {
        if (path === THEMES[temp]) {
          return true
        }
      }
    }
  }

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
          if (THEME) {
            let theme = getThemeByQuery(loaderContext.resourceQuery)
            let temp
            const isMulti = THEMES && !theme
            if (theme) {
              // 指定主题
              theme.name &&
                ((temp = THEMES && THEMES[theme.name]) ||
                  (theme.name = THEME.name))
              hasPath(theme.path) ||
                exists(THEME_DIR, theme.path) ||
                (theme.path = temp || THEME.path)
            } else {
              // 默认主题
              theme = THEME
            }

            content = `@import "~@/${theme.path}";`
            let alias
            let realTheme
            for (alias in ALIAS) {
              temp = ALIAS[alias]
              loaderContext.context.includes(temp) &&
                (exists(temp, (realTheme = theme.path)) ||
                  exists(
                    temp,
                    (realTheme = theme.path.replace(REG_INDEX, EXTENSION))
                  )) &&
                (content += `@import "~${alias}/${realTheme}";`)
            }

            if (isMulti) {
              // 多主题
              for (temp in THEMES) {
                if (temp !== theme.name) {
                  loaderContext.resourceQuery = `?theme=${temp}|${THEMES[temp].path}`
                  // TODO: 再引用一次，收集阶段 根据theme区分chunk
                  // sassLoader.call(loaderContext, '@import ""')
                }
              }
            }
          }

          return content
        },
      },
    },
  }
}
