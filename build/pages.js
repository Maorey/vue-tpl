/*
 * @Description: 自动检测并返回页面入口设置
 * @Author: 毛瑞
 * @Date: 2019-06-19 10:05:40
 */
const fs = require('fs')
const path = require('path')

const ENTRY_NAMES = ['main', 'index', 'entry', 'app', 'page'] // 入口文件名
const ENTRY_FORMATS = ['.ts', '.tsx', '.js', '.jsx'] // 入口文件格式

// html模板压缩选项
// https://github.com/jantimon/html-webpack-plugin
// https://github.com/kangax/html-minifier#options-quick-reference
const MINIFY = {
  html5: true,
  minifyJS: { output: { comments: /^!/ } }, // 压缩script标签里的js
  minifyCSS: true, // 压缩style标签里的css
  minifyURLs: true, // 压缩url
  ignoreCustomComments: [/^!/], // 保留的注释
  sortClassName: true, // class排序
  sortAttributes: true, // 属性排序
  removeEmptyAttributes: true, // 移除空属性
  removeRedundantAttributes: true, // 移除默认值
  processConditionalComments: true, // 处理条件注释(IE)
  removeStyleLinkTypeAttributes: true, // 去 link type="text/css"
  // 默认（不会自己合并 ￣へ￣ ...）
  removeComments: true, // 移除注释
  collapseWhitespace: true, // 去多余空格
  removeAttributeQuotes: true, // 去属性括号
  collapseBooleanAttributes: true, // Boolean属性简写
  removeScriptTypeAttributes: true, // 去script type属性
}

function getAllowedEntries(entries) {
  const REG_ENTRIES = /(?:--)?entries[= ](\w+(?:,\w+)*)/
  let arg
  for (arg of process.argv) {
    if ((arg = REG_ENTRIES.exec(arg))) {
      entries = arg[1]
      break
    }
  }
  return entries ? entries.split(',') : 0
}
function getEntryFile(dir, files) {
  let fileName
  for (const entry of files) {
    for (const format of ENTRY_FORMATS) {
      fileName = entry + format
      if (fs.existsSync(path.join(dir, fileName))) {
        return fileName
      }
    }
  }
}

/** 获取页面入口
 * @param {Boolean} isProd 是否生产环境
 *
 * @returns {Object} 页面入口配置
 */
module.exports = function(isProd, entries) {
  const PAGRS_NAME = 'pages' // 存放页面代码目录名
  const ROOT_DIR = path.resolve()
  const SRC_DIR = path.join(ROOT_DIR, 'src') // html对应入口代码路径
  const PUB_DIR = path.join(ROOT_DIR, 'public') // html模板只考虑放在根目录
  const PAGRS_DIR = path.join(SRC_DIR, PAGRS_NAME) // 存放页面代码目录
  const templates = fs.readdirSync(PUB_DIR, { withFileTypes: true })
  const REG_DIR_FILE = /[\\/]\w+\.\w+$/
  const REG_TEMPLATE = /\.html$/
  const pages = {}

  let isEmpty = true
  let templateName
  let entryNames
  let entryName
  const uesd = { undefined: true } // 已经被使用的入口
  entries = getAllowedEntries(entries)
  for (const dirent of templates) {
    if (dirent.isFile() && dirent.name.match(REG_TEMPLATE)) {
      templateName = dirent.name.replace(REG_TEMPLATE, '')
      if (entries.length && !entries.includes(templateName)) {
        continue
      }

      isEmpty = false
      entryNames = [templateName, ...ENTRY_NAMES]
      entryName = getEntryFile(SRC_DIR, entryNames) // src下页面入口
      if (uesd[entryName]) {
        // src下页面文件夹
        entryName = getEntryFile(path.join(SRC_DIR, templateName), entryNames)
        entryName = entryName && `${templateName}/${entryName}`

        if (uesd[entryName]) {
          // pages下页面入口
          entryName = getEntryFile(PAGRS_DIR, entryNames)
          entryName = entryName && `${PAGRS_NAME}/${entryName}`

          if (uesd[entryName]) {
            // pages下页面文件夹
            entryName = getEntryFile(
              path.join(PAGRS_DIR, templateName),
              entryNames
            )
            entryName =
              entryName && `${PAGRS_NAME}/${templateName}/${entryName}`

            if (uesd[entryName]) {
              continue
            }
          }
        }
      }
      uesd[entryName] = true

      pages[templateName] = {
        entry: 'src/' + entryName, // page 的入口
        template: 'public/' + dirent.name, // 模板位置
        filename: templateName + '.html', // 输出文件名
        // 压缩选项
        // https://github.com/jantimon/html-webpack-plugin
        // https://github.com/kangax/html-minifier#options-quick-reference
        minify: isProd && MINIFY,
        // chunks: ['dm', templateName], // 不支持方法/正则... 【有 insert-preload 自动补齐了】
        // 自定义目录别名
        alias:
          entryName.match(REG_DIR_FILE) &&
          path.resolve(SRC_DIR, entryName, '../'),
      }
    }
  }

  if (isEmpty) {
    throw new Error('请在' + PUB_DIR + '目录下提供html模板')
  }

  return pages
}
