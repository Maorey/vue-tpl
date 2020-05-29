/*
 * @Description: 设置别名
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:26:08
 */
const fs = require('fs')
const path = require('path')
const updateJSON = require('./updateJSON')

function getArgs() {
  const REG_ROUTE = /(?:--)?alias[= ](~?\w+(?:\.\w+)?~?(?:,~?\w+(?:\.\w+)?~?)*)/
  let args, i
  for (args of process.argv) {
    if ((args = REG_ROUTE.exec(args))) {
      args = args[1].split(',')
      for (i = 0; i < args.length; i++) {
        args[i] = args[i].split('.')
      }
      return args // [ [入口, 指令]/[指令] ...]
    }
  }
}

/** 设置入口目录别名 (包含入口和入口下的components目录)
 * @param {Objects} pages 页面入口配置
 * @param {ChainWebpack} config
 * @param {Object} ALIAS 别名字典
 * @param {Array} ALIAS_CONFIG 别名配置
 */
module.exports = function(pages, config, ALIAS, ALIAS_CONFIG) {
  const SUFFIX = '/*'
  const REG_BACKSLASH = /\\/g
  const ROOT_DIR = path.resolve()
  const TS_PATHS = { '@/*': ['src/*'] }

  let alias = '@com'
  let folderName = path.join(ROOT_DIR, 'src/components')

  const setAlias = () => {
    config.resolve.alias.set(alias, folderName)
    ALIAS[alias] = folderName // 【目录层级高的在前，scss变量才能正确注入】

    TS_PATHS[alias + SUFFIX] = [
      path.relative(ROOT_DIR, folderName).replace(REG_BACKSLASH, '/') + SUFFIX,
    ]
  }
  fs.existsSync(folderName) && setAlias()

  let tmp, entry
  for (entry in pages) {
    tmp = pages[entry]
    if (tmp.alias) {
      alias = '@' + entry
      folderName = tmp.alias
      setAlias()

      alias = '@' + entry + 'Com'
      folderName = path.join(tmp.alias, 'components')
      fs.existsSync(folderName) && setAlias()
    }
  }

  /// 【路由别名配置】 ///
  const DIC = {} // for 环境变量
  if (ALIAS_CONFIG && ALIAS_CONFIG.length) {
    const args = getArgs()
    let page, arg, i, j
    for (entry of ALIAS_CONFIG) {
      alias = entry[1].split('/')
      alias[0] || alias.shift()
      if (pages[alias[0]]) {
        page = alias.shift()
        folderName = path.join(pages[page].alias, alias.join('/'))
      } else {
        page = ''
        folderName = path.join(ROOT_DIR, entry[1])
        if (args) {
          for (tmp in pages) {
            alias = pages[tmp].alias
            if (
              folderName.startsWith(
                alias.endsWith(path.sep) ? alias : alias + path.sep
              )
            ) {
              page = tmp
              break
            }
          }
        }
      }

      if (entry[2] && typeof entry[2] === 'string') {
        entry[3] = entry[2]
        entry[2] = 0
      }

      if (args) {
        for (i = arg = 0, j = args.length; i < args.length; i++) {
          tmp = args[i]
          if (!tmp[1]) {
            j > i && (j = i)
          } else if (page && page === tmp[0]) {
            arg = tmp[1]
            args.splice(i, 1)
            break
          }
        }
        if (!arg && !(arg = entry[3]) && args[j]) {
          arg = args[j][0]
          args.splice(j, 1)
        }
      } else {
        arg = entry[3] || ''
      }

      if (!entry[2] || (arg && entry[2].includes(arg))) {
        alias = entry[0]
        arg && (folderName += '.' + arg)
        ;(DIC[page] || (DIC[page] = [])).push(arg || '')
        fs.existsSync(folderName) && setAlias()
      }
    }
  }

  updateJSON('tsconfig.json', 'compilerOptions.paths', TS_PATHS)

  return DIC
}
