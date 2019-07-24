/*
 * @description: 插入 preload 的资源
 * 依赖:
 *  https://github.com/jantimon/html-webpack-plugin
 *  @vue/preload-webpack-plugin (fork:https://github.com/GoogleChromeLabs/preload-webpack-plugin)
 * @Author: Maorey
 * @Date: 2019-01-17 11:42:24
 */

const PLUGIN_NAME = 'insert-preload' // 插件名

module.exports = class {
  // https://webpack.docschina.org/api/plugins/
  apply(compiler) {
    // 添加 preload 的资源
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      // html-webpack-plugin 钩子
      compilation.hooks.htmlWebpackPluginAlterAssetTags &&
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(
          PLUGIN_NAME,
          htmlPluginData => this.insert(htmlPluginData)
        )
    })
  }

  /** 补充缺失的资源
   * @param {Object} htmlPluginData html-webpack-plugin 插件数据
   */
  insert(htmlPluginData) {
    // 标签对象结构: 只需要关心: head 里的 link, body 里的 script
    // {
    //   tagName: String,
    //   attributes: {
    //     /// link ///
    //     href: String,
    //     rel: String, // 只需要关心: stylesheet 用于去重
    //     as: String, // rel:preload 时存在
    //     // ...

    //     /// script ///
    //     src: String,
    //   },
    // }
    const head = htmlPluginData.head
    const body = htmlPluginData.body // 考虑只有script

    const styles = [] // 待插入样式
    const scripts = [] // 待插入脚本

    const relStyle = 'stylesheet'

    // 找到缺的标签
    // 样式插入位置（最后一个样式/preload标签后）
    let index = 0
    for (let len = head.length, tmp; index < len; index++) {
      tmp = head[index].attributes // 当前属性
      // preload 只认 as 属性吧
      if (tmp.as || tmp.rel === relStyle) {
        switch (tmp.as) {
          case 'style': // css
            styles.push({
              tagName: 'link',
              attributes: {
                rel: relStyle,
                href: tmp.href,
              },
            })
            break
          case 'script': // js
            // 去重
            for (let el of body) {
              if (tmp.href === el.attributes.src) {
                tmp.href = 0
                break
              }
            }
            tmp.href &&
              scripts.push({
                tagName: 'script',
                closeTag: true,
                attributes: {
                  defer: true,
                  src: tmp.href,
                  type:
                    tmp.rel === 'modulepreload' ? 'module' : 'text/javascript',
                },
              })
            break
          default:
            // 样式标签 去重
            tmp = styles.findIndex(el => el.attributes.href === tmp.href)
            tmp >= 0 && styles.splice(tmp, 1)
        }

        // 下一个不是样式则把样式放在下一个
        tmp = (head[index + 1] || {}).attributes || {}
        if (!(tmp.as || tmp.rel === relStyle)) {
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
