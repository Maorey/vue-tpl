// const ora = require('ora')
// const spinner = ora({
//   text: 'Building themes...',
//   color: 'cyan',
// }).start()
const fs = require('fs')
const path = require('path')

const CACHE_EXISTS = {}
const EXTENSION = '.scss'
const INDEX = '/index.scss'
const REG_EXTENSION = /\.scss$/
const REG_INDEX = /\/index\.scss$/
const REG_SCSS = /\/[^/]+\.scss$/
const REG_THEME = /(?:^\??|&)theme=([^|&]*)\|?([^&]*)/
// eslint-disable-next-line max-len
const REG_IMPORT = /(?:[\s\n;]|^)import[\s\n]+(?:([\w\W]*?)[\s\n]+from[\s\n]+)?['"][\w\W]*\.(scss|vue)\?[\w\W]*?(?:(?:lang=|theme=)([^&]*))?[\w\W]*?['"]/g

const PLUGIN_NAME = 'theme-loader'

let THEME
let THEMES
let THEME_DIR
let CACHE_INIT

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
    let temp
    for (temp in THEMES) {
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
  const THEME_DIR_PATH = ENV.THEME_DIR
  THEME_DIR = path.join(path.join(process.cwd(), 'src'), THEME_DIR_PATH)

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
    } else {
      // 构建多主题
      THEMES = {}
      THEMES[THEME.name] = THEME.path
      let file
      let name
      for (file of fs.readdirSync(THEME_DIR, { withFileTypes: true })) {
        file.isFile()
          ? THEME_NAME === (name = file.name.replace(REG_EXTENSION, '')) &&
            (file = 0)
          : (THEME_NAME !== (name = file.name) &&
              exists(THEME_DIR, (file.name += INDEX))) ||
            (file = 0)
        file && (THEMES[name] = `${THEME_DIR_PATH}/${file.name}`)
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
      theme.name &&
        ((temp = THEMES && THEMES[theme.name]) || (theme.name = THEME.name))
      hasPath(theme.path) ||
        exists(THEME_DIR, theme.path) ||
        (theme.path = temp || THEME.path)
    } else {
      // 默认主题
      theme = THEME
    }
    return theme
  }
}

// 多主题loader 从js源码处理多主题样式
module.exports = function(source) {
  init()
  this.callback(
    null,
    (typeof source === 'string' ? source : source.toString()).replace(
      REG_IMPORT,
      (match, variable, search) => {
        // 处理多主题
        return match
      }
    )
  )
}
// 插件: 不同theme到不同chunk (顺便合并下小文件？)
module.exports.plugin = class {
  constructor() {
    init()
  }
  // https://webpack.docschina.org/api/plugins/
  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation =>
      compilation.hooks.optimizeChunkModules.tap(
        PLUGIN_NAME,
        (chunks, modules) => {
          // 不同theme到不同chunk
        }
      )
    )
  }
}

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
