// const ora = require('ora')
// const spinner = ora({
//   text: 'Building themes...',
//   color: 'cyan',
// }).start()
const fs = require('fs')
const path = require('path')
const loaderUtils = require('loader-utils')
// eslint-disable-next-line max-len
const REG_IMPORT = /((?:import\s|require\s*\()[\w\W]*?\.scss(?:\?.*?))(['"][\s\n]*\)?)/g
// eslint-disable-next-line max-len
const REG_STYLE = /(<[\s\n]*style(?:[\s\n]*|[\s\n]+.*?lang="scss".*?))(>[\w\W]*?<[\s\n]*\/[\s\n]*style[\s\n]*>)/g
const REG_THEME = /&?theme=(.*?)!?(.*?)&?/
const REG_THEME1 = /[\s\n]theme="([\w\W]*?)!?(.*?)"/
function findTheme(themes, theme) {
  let item
  for (item of themes) {
    if (theme === item.name) {
      return item
    }
  }
}
function replacePath(query, path) {
  const index = query.indexOf('!')
  return `${index > 0 ? query.substring(0, index) : query}!${path}`
}

/** themeLoader 为ts|vue|tsx|js|jsx文件中引入的scss增加其他scss主题引入
 *    【查询参数: theme=name!path】
 * @param {String|Buffer} content 文件内容
 */
module.exports = function(content) {
  // 不通过this.data共享 一次load处理好参数
  const { themes, context } = loaderUtils.getOptions(this) || {}
  typeof content === 'string' || (content = content.toString())

  // import/require scss 有?theme=name!path时:
  //  name!path正确跳过 name正确补上path 都不对默认
  content = content.replace(REG_IMPORT, (str, g1, g2) => {
    let t = REG_THEME.exec(g1)
    if (t) {
      const match = t[0].trim()
      const file = (t[2] || '').trim()
      if ((t = (t[1] || '').trim()) && (t = findTheme(themes, t))) {
        if (file && fs.existsSync(path.join(context, file))) {
          // theme/path都正确
          return str
        }
        // 只有theme存在
        return g1.replace(REG_IMPORT, replacePath(match, t.path)) + g2
      }
      // 都不对
      g1 =
        g1.replace(
          REG_THEME,
          str[0] === '&' && str[str.length - 1] === '&' ? '&' : ''
        ) + '&'
    } else {
      // 未带查询参数
      g1 += g1.lastIndexOf('?') > 0 ? '&' : '?'
    }

    str = ''
    for (t of themes) {
      str += `${g1}theme=${t.name}!${t.path + g2};`
    }

    return str
  })
  // <style> 有theme="name!path"时:
  //  name!path正确跳过 name正确补上path 都不对默认
  content = content.replace(REG_STYLE, (str, g1, g2) => {
    let t = REG_THEME1.exec(g1)
    if (t) {
      const match = t[0].trim()
      const file = (t[2] || '').trim()
      if ((t = (t[1] || '').trim()) && (t = findTheme(themes, t))) {
        if (file && fs.existsSync(path.join(context, file))) {
          // theme/path都正确
          return str
        }
        // 只有theme存在
        return g1.replace(REG_IMPORT, replacePath(match, t.path)) + g2
      }
      // 都不对
      g1 = g1.replace(REG_THEME1, '')
    }

    str = ''
    for (t of themes) {
      str += `${g1} theme="${t.name}!${t.path}"${g2}`
    }

    return str
  })

  this.callback(null, content) // this.async()(null, content)
}
