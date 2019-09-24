/*
 * @description: 插入 preload 的资源 & 基于scss变量打包主题
 * 依赖:
 *  https://github.com/jantimon/html-webpack-plugin
 *  @vue/preload-webpack-plugin (fork:https://github.com/GoogleChromeLabs/preload-webpack-plugin)
 * @Author: Maorey
 * @Date: 2019-01-17 11:42:24
 */

const PLUGIN_NAME = 'insert-preload' // 插件名

/** 插入 preload 的资源插件
 */
module.exports = class {
  /**
   * @param {Object} option 选项
   *  {
   *    runtime:String 待移除preload的runtime名，falsy: 不移除, true = 'runtime', String: 指定名字
   *    defer:Boolean 脚本是否defer 默认true
   *    async:Boolean 脚本是否async 默认false (和defer只能有一个)
   *  }
   */
  constructor(option = {}) {
    let runtime = option.runtime
    runtime === true && (runtime = 'runtime')
    this._REG_REMOVE = runtime && new RegExp(`(?:[\\/]|^)${runtime}\\..*\\.js$`)
    this._SA =
      option.defer === false ? option.async === true && 'async' : 'defer'
  }

  // https://webpack.docschina.org/api/plugins/
  apply(compiler) {
    // 添加 preload 的资源
    compiler.hooks.compilation.tap(
      PLUGIN_NAME,
      compilation =>
        // html-webpack-plugin 钩子
        compilation.hooks.htmlWebpackPluginAlterAssetTags &&
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(
          PLUGIN_NAME,
          htmlPluginData => this.insert(htmlPluginData)
        )
    )
    // 不能这么加loader
    // const REG_EXCLUDE = /[\\/]node_modules[\\/]/
    // const REG_INCLUDE = /\.(?:ts|vue|tsx|js|jsx)$/
    // compiler.hooks.thisCompilation.tap(PLUGIN_NAME, compilation =>
    //   compilation.hooks.buildModule.tap(
    //     PLUGIN_NAME,
    //     module =>
    //       THEMES &&
    //       !REG_EXCLUDE.test(module.rawRequest) &&
    //       REG_INCLUDE.test(module.rawRequest) &&
    //       module.loaders.push(themeLoader)
    //   )
    // )
  }

  // 补充缺失的资源
  insert(htmlPluginData) {
    const head = htmlPluginData.head
    const body = htmlPluginData.body // 考虑只有script

    const styles = [] // 待插入样式
    const scripts = [] // 待插入脚本

    const script = 'script'
    const relStyle = 'stylesheet'
    const REG_RUNTIME = this._REG_REMOVE

    const SCRIPT_ATTRIBUTE = this._SA
    let el
    if (SCRIPT_ATTRIBUTE) {
      for (el of body) {
        el.tagName === script && (el.attributes[SCRIPT_ATTRIBUTE] = true)
      }
    }

    let temp
    let index = -1
    let len = head.length
    while (++index < len) {
      temp = head[index].attributes // 当前属性
      // preload 只认 as 属性吧
      if (temp.as || temp.rel === relStyle) {
        switch (temp.as) {
          case 'style': // css
            styles.push({
              tagName: 'link',
              attributes: {
                rel: relStyle,
                href: temp.href,
              },
            })
            break
          case script: // js
            // 去掉runtime
            if (REG_RUNTIME && REG_RUNTIME.test(temp.href)) {
              head.splice(index--, 1)
              len--
            }
            // 去重
            for (el of body) {
              if (temp.href === el.attributes.src) {
                el = false // 兼职
                break
              }
            }
            el === false ||
              scripts.push({
                tagName: script,
                closeTag: true,
                attributes: {
                  src: temp.href,
                  type:
                    temp.rel === 'modulepreload' ? 'module' : 'text/javascript',
                  ...(SCRIPT_ATTRIBUTE ? { [SCRIPT_ATTRIBUTE]: true } : {}),
                },
              })
            break
          default:
            // css去重
            temp = styles.findIndex(el => el.attributes.href === temp.href)
            temp >= 0 && styles.splice(temp, 1)
        }

        // 下一个不是样式则把样式放在下一个
        temp = (head[index + 1] || {}).attributes || {}
        if (!(temp.as || temp.rel === relStyle)) {
          ++index
          break
        }
      }
    }

    // 插入样式 & 脚本
    head.splice(index, 0, ...styles)
    body.push(...scripts)

    return htmlPluginData
  }
}
