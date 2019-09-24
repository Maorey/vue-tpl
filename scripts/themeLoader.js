// const ora = require('ora')
// const spinner = ora({
//   text: 'Building themes...',
//   color: 'cyan',
// }).start()
const loaderUtils = require('loader-utils')

const REG_IMPORT = /((?:import\s|require\s*\()[\w\W]*?\.scss)(['"][\s\n]*\)?)/g
// eslint-disable-next-line max-len
const REG_STYLE = /(<[\s\n]*style(?:[\s\n]*|[\s\n]+[^>]*))(>[\w\W]*?<[\s\n]*\/[\s\n]*style[\s\n]*>)/g
const REG_THEME = /[\s\n]theme="(.*?)"[\s\n]*(?:var="(.*?)")?/
/** themeLoader 为ts|vue|tsx|js|jsx文件中引入的scss增加其他scss主题引入
 * @param {String|Buffer} content 文件内容
 */
module.exports = function(content) {
  const themes = loaderUtils.getOptions(this).themes
  const callback = this.async()

  if (typeof content !== 'string') {
    content = content.toString()
  }
  // import/require scss
  content = content.replace(REG_IMPORT, (str, g1, g2) => {
    str = ''
    let t
    for (t of themes) {
      str += `${g1}?theme=${t.name}&var=${t.var + g2};`
    }

    return str
  })
  // <style theme="" var=""/> 俩都有跳过，只有theme补上path
  content = content.replace(REG_STYLE, (str, g1, g2) => {
    let t = REG_THEME.exec(g1)
    if (t) {
      if (t[2] && (t = t[1])) {
        return str
      }
      g1 = g1.replace(REG_THEME, '')
      if (t) {
        for (str of themes) {
          if (str.name === t) {
            return `${g1} theme="${t}" var="${str.var}"${g2}`
          }
        }
      }
    }

    str = ''
    for (t of themes) {
      str += `${g1} theme="${t}" var="${t.var}"${g2}`
    }

    return str
  })

  callback(null, content)
}
