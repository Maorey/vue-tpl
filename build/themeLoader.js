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
const REG_LANG = /(?:^\??|&)lang=([^&]*)/
const REG_THEME = /(?:^\??|&)theme=([^|&]*)\|?([^&]*)/
// require不管了
const REG_IMPORT = /(?:^|\n)import[\s\n]+(?:([\w\W]*?)[\s\n]+from[\s\n]+)?['"]([\w\W]*?)\.(scss|vue)(\?[\w\W]*?)?['"]/g

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
    for (let temp in THEMES) {
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
      let name
      for (let file of fs.readdirSync(THEME_DIR, { withFileTypes: true })) {
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
      theme.path &&
        (hasPath(theme.path) ||
          exists(THEME_DIR, theme.path) ||
          (theme.path = THEME.path))
    } else {
      // 默认主题
      theme = THEME
    }
    return theme
  }
}

// 多主题loader 从js源码处理多主题样式
module.exports = function(source) {
  this.callback(null, source)
  // init()
  // if (!THEMES) {
  //   this.callback(null, source)
  //   return
  // }
  // const info = {} // 收集的样式注入信息
  // const PREFIX = '$_STYLE'
  // let counter = 0
  // let lastImport = 0
  // source = (typeof source === 'string' ? source : source.toString()).replace(
  //   REG_IMPORT,
  //   (match, variable, name, type, query, index) => {
  //     // 处理多主题
  //     const lang = REG_LANG.exec(query)
  //     if (type === 'vue' && (!lang || lang[1] !== 'scss')) {
  //       return match
  //     }
  //     const theme = REG_THEME.exec(query)
  //     if (!theme || !theme[1]) {
  //       // 注入主题
  //       const dir = { type }
  //       match = ''
  //       for (let theme in THEMES) {
  //         match += `import ${(dir[theme] =
  //           PREFIX +
  //           counter++)} from "${name}.${type}?${query}&theme=${theme}"\n`
  //       }
  //       info[variable] = dir
  //       lastImport = Math.max(lastImport, index + match.length)
  //       return match
  //     }
  //     return match
  //   }
  // )

  // this.callback(
  //   null,
  //   'import $_SKIN from "@/utils/skin' +
  //     source.substring(0, lastImport) +
  //     (() => {
  //       let variables = ''
  //       for (let vars in info) {
  //         variables += `const ${vars} = () => ${JSON.stringify(
  //           info[vars]
  //         )}[$_SKIN.value]\n`
  //       }
  //       return variables
  //     })() +
  //     source.substring(lastImport)
  // )
}
// 插件: 不同theme到不同chunk (顺便合并下小文件？)
module.exports.plugin = class {
  constructor() {
    init()
  }
  // https://webpack.docschina.org/api/plugins/
  apply(compiler) {
    // compiler.hooks.compilation.tap(PLUGIN_NAME, compilation =>
    //   compilation.hooks.optimizeChunkAssets.tapAsync(
    //     PLUGIN_NAME,
    //     (chunks, callback) => {
    //       // 不同theme到不同chunk
    //       callback()
    //     }
    //   )
    // )
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
