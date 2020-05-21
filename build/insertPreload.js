/*
 * @description: 插入 preload 的资源 & inline-manifest
 * 依赖:
 *  https://github.com/jantimon/html-webpack-plugin
 *  @vue/preload-webpack-plugin (fork:https://github.com/GoogleChromeLabs/preload-webpack-plugin)
 * 合并: https://github.com/szrenwei/inline-manifest-webpack-plugin
 * @Author: Maorey
 * @Date: 2019-01-17 11:42:24
 */
const sourceMappingURL = require('source-map-url')

function getAssetName(chunks, reg) {
  const match = []
  for (const chunk of chunks) {
    reg.test(chunk.name) &&
      match.push({ name: chunk.name, file: chunk.files[0] })
  }
  return match
}
function inlineWhenMatched(compilation, scripts, manifestAssetNames, MERGE) {
  const result = []
  let inline
  let script
  let item
  let src
  let i
  for (i = 0; i < scripts.length; i++) {
    script = scripts[i]
    if (script.tagName === 'script') {
      src = script.attributes.src
      for (item of manifestAssetNames) {
        if (src.indexOf(item.file) >= 0) {
          src = sourceMappingURL.removeFrom(
            compilation.assets[item.file].source()
          )
          if (MERGE) {
            if (inline) {
              inline.innerHTML += src
            } else {
              inline = {
                i,
                tagName: 'script',
                closeTag: true,
                attributes: { type: 'text/javascript' },
                innerHTML: src,
              }
            }
          } else {
            delete script.attributes.src
            script.innerHTML = src
            result.push(script)
          }
          item = 0
          break
        }
      }
      if (!item) {
        continue
      }
    }
    result.push(script)
  }
  inline && result.splice(inline.i, 0, inline)

  return result
}

/** 插入 preload 的资源插件
 */
module.exports = class {
  /**
   * @param {Object} option 选项
   *  {
   *    runtime:String|Array<String>|RegExp 内联runtime(指定js文件)
   *    strict:Boolean 内联脚本是否严格模式
   *    defer:Boolean 脚本是否defer
   *    async:Boolean 脚本是否async (和defer只能有一个)
   *    skin:String 默认皮肤({skin}@*.css)
   *    noPreload:Boolean 是否去掉 preload
   *    noPrefetch:Boolean 是否去掉 prefetch
   *    banner:String|Function 添加横幅(比如版权注释/控制台打印信息等, 复用/新增<script>)
   *  }
   */
  constructor(option = {}) {
    /// 内联runtime ///
    let runtime = option.runtime
    if (runtime) {
      if (typeof runtime.test === 'function') {
        this._REG_RUNTIME = runtime
      } else {
        typeof runtime === 'string' && (runtime = [runtime])
        for (let i = 0; i < runtime.length; i++) {
          runtime[i] = new RegExp('(?<![^\\\\/])' + runtime[i])
        }
        this._REG_RUNTIME = {
          test(str) {
            for (const reg of runtime) {
              if (reg.test(str)) {
                return true
              }
            }
            return false
          },
        }
      }
    }
    /// 脚本属性 ///
    this._SA =
      option.defer === true ? 'defer' : option.async === true && 'async'
    /// 皮肤 ///
    this._REG_SKIN = (this._T = option.skin) && /([^\\/]+)@[^\\/]+\.css/
    /// preload & prefetch ///
    this._L = option.noPreload && 'preload'
    this._F = option.noPrefetch && 'prefetch'
    this._B = option.banner
    this._S = !option.strict && /['"]use\s+strict['"];?/gm
  }

  // https://webpack.docschina.org/api/plugins/
  apply(compiler) {
    /// insert-preload ///
    const PLUGIN1 = 'insert-preload'
    compiler.hooks.compilation.tap(PLUGIN1, compilation => {
      // html-webpack-plugin 钩子
      compilation.hooks.htmlWebpackPluginAlterAssetTags &&
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(
          PLUGIN1,
          htmlPluginData => this.insert(htmlPluginData)
        )
    })
    /// inline-manifest ///
    const REG_RUNTIME = this._REG_RUNTIME
    if (REG_RUNTIME) {
      const MERGE = this._SA
      const PLUGIN2 = 'inline-manifest'
      compiler.hooks.emit.tap(PLUGIN2, compilation => {
        for (const item of getAssetName(compilation.chunks, REG_RUNTIME)) {
          delete compilation.assets[item.file]
        }
      })
      compiler.hooks.compilation.tap(PLUGIN2, compilation => {
        compilation.hooks.htmlWebpackPluginAlterAssetTags &&
          compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
            PLUGIN2,
            (data, cb) => {
              const manifestAssetNames = getAssetName(
                compilation.chunks,
                REG_RUNTIME
              )

              manifestAssetNames.length &&
                ['head', 'body'].forEach(section => {
                  data[section] = inlineWhenMatched(
                    compilation,
                    data[section],
                    manifestAssetNames,
                    MERGE
                  )
                })

              cb(null, data)
            }
          )

        compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration &&
          compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(
            PLUGIN2,
            (htmlPluginData, cb) => {
              const runtime = []
              const assets = htmlPluginData.assets
              const manifestAssetNames = getAssetName(
                compilation.chunks,
                REG_RUNTIME
              )

              if (
                manifestAssetNames.length &&
                htmlPluginData.plugin.options.inject === false
              ) {
                for (const item of manifestAssetNames) {
                  runtime.push('<script>')
                  runtime.push(
                    sourceMappingURL.removeFrom(
                      compilation.assets[item.file].source()
                    )
                  )
                  runtime.push('</script>')

                  const runtimeIndex = assets.js.indexOf(
                    assets.publicPath + item.file
                  )
                  if (runtimeIndex >= 0) {
                    assets.js.splice(runtimeIndex, 1)
                    delete assets.chunks[item.name]
                  }
                }
              }

              assets.runtime = runtime.join('')
              cb(null, htmlPluginData)
            }
          )
      })
    }
    /// banner ///
    const BANNER = this._B
    if (BANNER) {
      const PLUGIN3 = 'banner'
      const REG_STRICT = this._S
      compiler.hooks.compilation.tap(PLUGIN3, compilation => {
        compilation.hooks.htmlWebpackPluginAlterAssetTags &&
          compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
            PLUGIN3,
            (data, cb) => {
              let banner = typeof BANNER === 'string' ? BANNER : BANNER(data)
              banner &&
                ['head', 'body'].forEach(section => {
                  for (const tag of data[section]) {
                    if (tag.innerHTML && tag.tagName === 'script') {
                      REG_STRICT &&
                        (tag.innerHTML = tag.innerHTML.replace(REG_STRICT, ''))
                      if (banner) {
                        tag.innerHTML = banner + tag.innerHTML
                        banner = 0
                      }
                    }
                  }
                })
              banner &&
                data.body.unshift({
                  tagName: 'script',
                  closeTag: true,
                  innerHTML: banner,
                  attributes: { type: 'text/javascript' },
                })
              cb(null, data)
            }
          )
      })
    }
  }

  // 补充缺失的资源
  insert(htmlPluginData) {
    const head = htmlPluginData.head
    const body = htmlPluginData.body // 考虑只有script

    const styles = [] // 待插入样式
    const scripts = [] // 待插入脚本

    const script = 'script'
    const relStyle = 'stylesheet'
    const preload = this._L
    const prefetch = this._F
    const REG_RUNTIME = this._REG_RUNTIME

    const skin = this._T
    const REG_SKIN = this._REG_SKIN
    const relAlternate = 'alternate ' + relStyle

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
      // 去掉runtime/preload/prefetch
      if (
        (preload && temp.rel === preload) ||
        (prefetch && temp.rel === prefetch) ||
        (REG_RUNTIME && REG_RUNTIME.test(temp.href))
      ) {
        head.splice(index--, 1)
        len--
      }

      // preload 只认 as 属性吧
      if (temp.as || temp.rel === relStyle) {
        switch (temp.as) {
          case 'style': // css
            if (REG_SKIN && (el = REG_SKIN.exec(temp.href))) {
              styles.push({
                tagName: 'link',
                attributes: {
                  rel: skin === el[1] ? relStyle : relAlternate,
                  href: temp.href,
                  title: el[1],
                },
              })
            } else {
              styles.push({
                tagName: 'link',
                attributes: { rel: relStyle, href: temp.href },
              })
            }
            break
          case script: // js
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
        if (!(temp.as || temp.rel === relStyle || temp.rel === relAlternate)) {
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
