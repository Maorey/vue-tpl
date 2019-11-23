// const ora = require('ora')
// const spinner = ora({
//   text: 'Building themes...',
//   color: 'cyan',
// }).start()
const fs = require('fs')
const path = require('path')

const PLUGIN_NAME = 'theme-loader'

const EXTENSION = '.scss'
const INDEX = '/index.scss'

const REG_EXTENSION = /\.scss$/
const REG_INDEX = /\/index\.scss$/
const REG_SCSS = /\/[^/]+\.scss$/
const REG_LANG = /(?:^\??|&)lang=([^&]*)/
const REG_THEME = /(?:^\??|&)theme=([^|&]*)\|?([^&]*)/
// require不管了
const REG_IMPORT = /(?:^|\n)import[\s\n]+([^'"]+?)[\s\n]+from[\s\n]+['"]([^'"]+?)\.(scss|vue)(\?[^'"]+?)?['"]/g

const CACHE_EXISTS = {}
const DIR_SRC = path.join(process.cwd(), 'src')

let CACHE_INIT
/** 默认主题 { name, path }
 */
let THEME
/** 所有主题 { [name]: path }
 */
let THEMES
/** 主题文件夹相对路径
 */
let R_THEME
/** 根主题文件夹局对路径
 */
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

// 多主题loader 从js源码处理多主题样式
module.exports = function(source) {
  if (!init().THEMES) {
    this.callback(null, source)
    return
  }
  const info = {} // 收集的样式注入信息
  const PREFIX = '$_STYLE'
  let counter = 0
  let lastImport = 0
  let more = 0
  source = (typeof source === 'string' ? source : source.toString()).replace(
    REG_IMPORT,
    (match, variable, name, type, query = '?', index) => {
      // 处理多主题
      let temp = REG_LANG.exec(query)
      if (type === 'vue' && (!temp || temp[1] !== 'scss')) {
        return match
      }
      if (
        (type === 'scss' || type === 'vue') &&
        !(temp = REG_THEME.exec(query))
      ) {
        // 注入主题
        const len = match.length
        let strObj = '{'
        let vars

        match = '\n'
        for (temp in THEMES) {
          vars = PREFIX + counter++
          match += `import ${vars} from "${name}.${type +
            query}&theme=${temp}"\n`
          strObj += `"${temp}":${vars},`
        }
        info[variable] = strObj + '}'
        more += match.length - len
        lastImport = index + len + more
        return match
      }

      return match
    },
  )

  let variables = ''
  if (lastImport) {
    variables = '\nimport $_getCSSModule from "@/utils/getCSSModule"'
    for (const vars in info) {
      variables += `\nconst ${vars} = $_getCSSModule(${info[vars]})`
    }
    variables += '\n'
  }

  this.callback(
    null,
    source.substring(0, lastImport) + variables + source.substring(lastImport),
  )
}
// 插件: 不同theme到不同chunk (顺便合并下小文件？)
// hack mini-css-extract-plugin
module.exports.plugin = class {
  constructor() {
    init()
  }

  // https://webpack.docschina.org/api/plugins/
  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation =>
      compilation.hooks.optimizeChunkAssets.tapAsync(
        PLUGIN_NAME,
        (chunks, callback) => {
          // 不同theme到不同chunk
          callback()
        },
      ),
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
