// 换肤工具
const fs = require('fs')
const path = require('path')
const loaderUtils = require('loader-utils')

const PLUGIN_NAME = 'skin-loader'
const DEFAULT_HANDLER = path.resolve('src/skin')

const EXTENSION = '.scss'
const INDEX = '/index.scss'

const REG_EXTENSION = /\.scss$/
const REG_INDEX = /\/index\.scss$/
const REG_SCSS = /\/[^/]+\.scss$/
const REG_SKIN = /(?:\?|%3F|&|%26)skin(?:=|%3D)([^|&% ]*)(?:\||%7C)?([^&% ]*)/i

const CACHE_EXISTS = {}
const DIR_SRC = path.resolve('src')

let CACHE_INIT
/** 默认皮肤 { name, path } */
let SKIN
/** 所有皮肤 { [name]: path } */
let SKINS
/** 皮肤文件夹相对路径 */
let R_SKIN
/** 根皮肤文件夹局对路径 */
let DIR_SKIN

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
  if (SKINS) {
    for (const temp in SKINS) {
      if (path === SKINS[temp]) {
        return true
      }
    }
  }
}

function init(ENV = process.env) {
  if (CACHE_INIT) {
    return CACHE_INIT
  }
  R_SKIN = ENV.SKIN_DIR
  DIR_SKIN = path.join(DIR_SRC, R_SKIN)

  if (DIR_SKIN) {
    const SKIN_NAME = ENV.SKIN
    SKIN = SKIN_NAME &&
      (exists(DIR_SKIN, (SKIN = SKIN_NAME + EXTENSION)) ||
        exists(DIR_SKIN, (SKIN = SKIN_NAME + INDEX))) && {
      name: SKIN_NAME,
      path: `${R_SKIN}/${SKIN}`,
    }
    if (!SKIN) {
      // 单皮肤
      SKIN = (exists(DIR_SKIN + (SKIN = EXTENSION)) ||
        exists(DIR_SKIN + (SKIN = INDEX)) ||
        exists(DIR_SKIN)) && {
        path: R_SKIN + (SKIN || ''),
      }
    } else {
      // 多皮肤
      SKINS = {}
      SKINS[SKIN.name] = SKIN.path
      let name
      for (let file of fs.readdirSync(DIR_SKIN, { withFileTypes: true })) {
        file.isFile()
          ? ((name = file.name.replace(REG_EXTENSION, '') === file.name) ||
              name === SKIN_NAME) &&
            (file = 0)
          : (SKIN_NAME !== (name = file.name) &&
              exists(DIR_SKIN, (file.name += INDEX))) ||
            (file = 0)
        file && (SKINS[name] = `${R_SKIN}/${file.name}`)
      }
    }
  }

  return (CACHE_INIT = { SKIN, SKINS })
}
function getSkinByQuery(temp) {
  if (SKIN) {
    temp = REG_SKIN.exec(temp)
    let skin = temp && { name: temp[1], path: decodeURIComponent(temp[2]) }
    if (skin) {
      // 指定皮肤
      ;(skin.path &&
        (hasPath(skin.path) ||
          exists(DIR_SRC, skin.path) ||
          (exists(DIR_SKIN, skin.path) &&
            (skin.path = `${R_SKIN}/${skin.path}`)))) ||
        (skin.path = (SKINS && SKINS[skin.name]) || SKIN.path)
    } else {
      // 默认皮肤
      skin = SKIN
    }
    return skin
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

/// 皮肤loader ///
// 参考: multi-loader
module.exports = function(source) {
  this.callback(null, source)
}
module.exports.pitch = function() {
  this.cacheable()

  if (!(SKINS || init().SKINS)) {
    return
  }

  const resource = getResource(this.resource)
  if (REG_SKIN.test(resource)) {
    return
  }

  let resultSource = `// extracted by ${PLUGIN_NAME}\nimport getOb from '${getResource(
    (loaderUtils.getOptions(this) || {}).localHandler || DEFAULT_HANDLER
  )}'`
  let locals = ''
  for (const skin in SKINS) {
    resultSource += `\nimport ${skin} from '${resource}skin=${skin}'`
    locals += skin + ','
  }

  return `${resultSource}\nexport default ${SKIN.name} && getOb({${locals}})`
}
/// 其他 ///
module.exports.init = init
module.exports.getSkinByQuery = getSkinByQuery
module.exports.exists = function(dir, file) {
  return (
    (exists(dir, file) ||
      exists(dir, (file = file.replace(REG_INDEX, EXTENSION))) ||
      exists(dir, (file = file.replace(REG_SCSS, INDEX)))) &&
    file
  )
}
