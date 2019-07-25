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
 * @param {string} CURRENT_DIR 项目根目录
 */
module.exports = function(pages, config, CURRENT_DIR) {
  const TS_PATHS = {
    // ts 目录别名
    '@/*': ['src/*'],
  }

  let alias = '@com'
  let folderName = path.resolve('src/components')

  const SUFFIX = '/*'
  const REG_BACKSLASH = /\\/g
  const setAlias = () => {
    config.resolve.alias.set(alias, folderName)

    TS_PATHS[alias + SUFFIX] = [
      folderName.replace(CURRENT_DIR, '').replace(REG_BACKSLASH, '/') + SUFFIX,
    ]
  }
  setAlias()

  let tmp
  for (let entryName in pages) {
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

  updateJSON('tsconfig.json', 'compilerOptions.paths', TS_PATHS)
}
