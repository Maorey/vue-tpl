/*
 * @Description: 设置别名
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:26:08
 */
const path = require('path')
const updateJSON = require('./updateJSON')

/** 设置入口目录别名 (包含入口和入口下的components目录)
 * @param {Objects} pages 页面入口配置
 * @param {ChainWebpack} config
 * @param {Object} ALIAS 别名字典
 * @param {Array} ROUTES 路由别名
 */
module.exports = function(pages, config, ALIAS, ROUTES) {
  const TS_PATHS = {
    // ts 目录别名
    '@/*': ['src/*'],
  }
  const CURRENT_DIR = path.resolve()
  // 【应有序，先目录层级高的，scss变量才能正确注入】
  // ALIAS['@'] = path.join(CURRENT_DIR, 'src')

  let alias = '@com'
  let folderName = path.join(CURRENT_DIR, 'src/components')

  const SUFFIX = '/*'
  const REG_BACKSLASH = /\\/g
  const setAlias = () => {
    config.resolve.alias.set(alias, folderName)
    ALIAS[alias] = folderName

    TS_PATHS[alias + SUFFIX] = [
      path.relative(CURRENT_DIR, folderName).replace(REG_BACKSLASH, '/') +
        SUFFIX,
    ]
  }
  setAlias()

  let tmp
  for (const entryName in pages) {
    tmp = pages[entryName]
    if (tmp.alias) {
      alias = '@' + entryName
      folderName = tmp.alias
      setAlias()

      alias = '@' + entryName + 'Com'
      folderName = path.join(tmp.alias, 'components')
      setAlias()
    }
  }

  /// 【路由别名及根据cli参数加载】 ///
  if (ROUTES && ROUTES.length) {
    const args = process.argv
    let route, prefix, type, arg, i
    for (route of ROUTES) {
      alias = route[0]
      folderName = path.join(CURRENT_DIR, route[1])
      route = route[2]

      prefix = '--' // 兼职
      for (i = 3; i < args.length; i++) {
        arg = args[i]
        for (type of route) {
          if (!arg.indexOf(type) || !arg.indexOf(prefix + type)) {
            folderName += '.' + type
            prefix = false
            break
          }
        }
        if (prefix === false) {
          break
        }
      }
      setAlias()
    }
  }

  updateJSON('tsconfig.json', 'compilerOptions.paths', TS_PATHS)
}
