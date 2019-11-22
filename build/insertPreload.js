/*
 * @description: 插入 preload 的资源 & 基于scss变量打包主题
 * 依赖:
 *  https://github.com/jantimon/html-webpack-plugin
 *  @vue/preload-webpack-plugin (fork:https://github.com/GoogleChromeLabs/preload-webpack-plugin)
 * 合并: https://github.com/szrenwei/inline-manifest-webpack-plugin
 * @Author: Maorey
 * @Date: 2019-01-17 11:42:24
 */
const sourceMappingURL = require('source-map-url')

const PLUGIN_NAME = 'insert-preload'

function getAssetName(chunks, reg) {
  const match = []
  for (let chunk of chunks) {
    reg.test(chunk.name) &&
      match.push({ name: chunk.name, file: chunk.files[0] })
  }
  return match
}
function inlineWhenMatched(compilation, scripts, manifestAssetNames) {
  return scripts.map(script => {
    if (script.tagName === 'script') {
      const src = script.attributes.src
      for (let item of manifestAssetNames) {
        if (src.indexOf(item.file) >= 0) {
          return {
            tagName: 'script',
            closeTag: true,
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: sourceMappingURL.removeFrom(
              compilation.assets[item.file].source(),
            ),
          }
        }
      }
    }

    return script
  })
}

/** 插入 preload 的资源插件
 */
module.exports = class {
  /**
   * @param {Object} option 选项
   *  {
   *    runtime:String|Array<String>|RegExp 内联runtime
   *    defer:Boolean 脚本是否defer 默认true
   *    async:Boolean 脚本是否async 默认false (和defer只能有一个)
   *  }
   */
  constructor(option = {}) {
    let runtime = option.runtime
    if (runtime) {
      if (typeof runtime.test === 'function') {
        this._REG_RUNTIME = runtime
      } else {
        typeof runtime === 'string' && (runtime = [runtime])
        for (let i = 0; i < runtime.length; i++) {
          runtime[i] = new RegExp(runtime[i])
        }
        this._REG_RUNTIME = {
          test(str) {
            for (let reg of runtime) {
              if (reg.test(str)) {
                return true
              }
            }
            return false
          },
        }
      }
    }
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
          htmlPluginData => this.insert(htmlPluginData),
        ),
    )
    // inline-manifest
    const REG_RUNTIME = this._REG_RUNTIME
    if (REG_RUNTIME) {
      compiler.hooks.emit.tap(PLUGIN_NAME, compilation => {
        for (let item of getAssetName(compilation.chunks, REG_RUNTIME)) {
          delete compilation.assets[item.file]
        }
      })
      compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
          PLUGIN_NAME,
          (data, cb) => {
            const manifestAssetNames = getAssetName(
              compilation.chunks,
              REG_RUNTIME,
            )

            manifestAssetNames.length &&
              ['head', 'body'].forEach(section => {
                data[section] = inlineWhenMatched(
                  compilation,
                  data[section],
                  manifestAssetNames,
                )
              })

            cb(null, data)
          },
        )

        compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(
          PLUGIN_NAME,
          (htmlPluginData, cb) => {
            const runtime = []
            const assets = htmlPluginData.assets
            const manifestAssetNames = getAssetName(
              compilation.chunks,
              REG_RUNTIME,
            )

            if (
              manifestAssetNames.length &&
              htmlPluginData.plugin.options.inject === false
            ) {
              for (let item of manifestAssetNames) {
                runtime.push('<script>')
                runtime.push(
                  sourceMappingURL.removeFrom(
                    compilation.assets[item.file].source(),
                  ),
                )
                runtime.push('</script>')

                const runtimeIndex = assets.js.indexOf(
                  assets.publicPath + item.file,
                )
                if (runtimeIndex >= 0) {
                  assets.js.splice(runtimeIndex, 1)
                  delete assets.chunks[item.name]
                }
              }
            }

            assets.runtime = runtime.join('')
            cb(null, htmlPluginData)
          },
        )
      })
    }
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
    const REG_RUNTIME = this._REG_RUNTIME

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
