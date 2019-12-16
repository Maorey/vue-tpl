// 多主题g构建工具
// const ora = require('ora')
// const spinner = ora({
//   text: 'Building themes...',
//   color: 'cyan',
// }).start()
const fs = require('fs')
const path = require('path')
const loaderUtils = require('loader-utils')

const PLUGIN_NAME = 'theme-loader'
const DEFAULT_HANDLER = path.resolve('src/utils/theme')

const EXTENSION = '.scss'
const INDEX = '/index.scss'

const REG_EXTENSION = /\.scss$/
const REG_INDEX = /\/index\.scss$/
const REG_SCSS = /\/[^/]+\.scss$/
const REG_THEME = /[?&]theme=([^|& ]*)\|?([^& ]*)/

const CACHE_EXISTS = {}
const DIR_SRC = path.resolve('src')

let CACHE_INIT
/** 默认主题 { name, path } */
let THEME
/** 所有主题 { [name]: path } */
let THEMES
/** 主题文件夹相对路径 */
let R_THEME
/** 根主题文件夹局对路径 */
let DIR_THEME

function exists(rootDir, fileName) {
  fileName = path.join(rootDir, fileName || '')
  rootDir = CACHE_EXISTS[fileName]
  if (rootDir === undefined) {
    rootDir = CACHE_EXISTS[fileName] = fs.existsSync(fileName)
    setTimeout(() => (CACHE_EXISTS[fileName] = undefined), 20000)
  }

  return rootDir
}
function hasPath(path) {
  if (THEMES) {
    for (const temp in THEMES) {
      if (path === THEMES[temp]) {
        return true
      }
    }
  }
}

function init(ENV = process.env) {
  if (CACHE_INIT) {
    return CACHE_INIT
  }
  R_THEME = ENV.THEME_DIR
  DIR_THEME = path.join(DIR_SRC, R_THEME)

  if (DIR_THEME) {
    const THEME_NAME = ENV.THEME
    THEME = THEME_NAME &&
      (exists(DIR_THEME, (THEME = THEME_NAME + EXTENSION)) ||
        exists(DIR_THEME, (THEME = THEME_NAME + INDEX))) && {
      name: THEME_NAME,
      path: `${R_THEME}/${THEME}`,
    }
    if (!THEME) {
      // 单主题
      THEME = (exists(DIR_THEME + (THEME = EXTENSION)) ||
        exists(DIR_THEME + (THEME = INDEX))) && {
        path: `${R_THEME}/${THEME}`,
      }
    } else {
      // 构建多主题
      THEMES = {}
      THEMES[THEME.name] = THEME.path
      let name
      for (let file of fs.readdirSync(DIR_THEME, { withFileTypes: true })) {
        file.isFile()
          ? THEME_NAME === (name = file.name.replace(REG_EXTENSION, '')) &&
            (file = 0)
          : (THEME_NAME !== (name = file.name) &&
              exists(DIR_THEME, (file.name += INDEX))) ||
            (file = 0)
        file && (THEMES[name] = `${R_THEME}/${file.name}`)
      }
    }
  }

  return (CACHE_INIT = { THEME, THEMES })
}
function getThemeByQuery(temp) {
  if (THEME) {
    temp = REG_THEME.exec(temp)
    let theme = temp && { name: temp[1], path: temp[2] }
    if (theme) {
      // 指定主题
      ;(theme.path &&
        (hasPath(theme.path) ||
          exists(DIR_SRC, theme.path) ||
          (exists(DIR_THEME, theme.path) &&
            (theme.path = `${R_THEME}/${theme.path}`)))) ||
        (theme.path = THEMES[theme.name] || THEME.path)
    } else {
      // 默认主题
      theme = THEME
    }
    return theme
  }
}

function getResource(resource) {
  return (resource.includes('?')
    ? resource.endsWith('&')
      ? resource
      : resource + '&'
    : resource + '?'
  ).replace(/\\/g, '\\\\')
}

/// 多主题loader ///
// 参考: multi-loader
module.exports = function(source) {
  this.callback(null, source)
}
module.exports.pitch = function() {
  this.cacheable()

  if (!(THEMES || init().THEMES)) {
    return
  }

  const resource = getResource(this.resource)
  if (REG_THEME.test(resource)) {
    return
  }

  let resultSource = `// extracted by ${PLUGIN_NAME}\nimport getOb from '${getResource(
    (loaderUtils.getOptions(this) || {}).localHandler || DEFAULT_HANDLER
  )}'`
  let locals = ''
  let first = 0
  for (const theme in THEMES) {
    first || (first = theme)
    resultSource += `\nimport ${theme} from '${resource}theme=${theme}'`
    locals += theme + ','
  }

  return `${resultSource}\nlet locals\n${first} && (locals = getOb({${locals}}))\nexport default locals`
}
/// 其他 ///
module.exports.init = init
module.exports.getThemeByQuery = getThemeByQuery
module.exports.exists = function(dir, file) {
  return (
    (exists(dir, file) ||
      exists(dir, (file = file.replace(REG_INDEX, EXTENSION))) ||
      exists(dir, (file = file.replace(REG_SCSS, INDEX)))) &&
    file
  )
}
