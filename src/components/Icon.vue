<!-- 彩色/图片图标 -->
<script lang="tsx">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import Vue, { CreateElement } from 'vue'
import { on } from '@/utils/eventBus'
import COLOR from '@/scss/export/color.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const REG_NUM = /\s*([\d.]+)(\w+)/
const loadingState = Vue.observable({ value: 0 })
import(/* webpackChunkName: "icon" */ '@/scss/font/fonts')
  .then(res => {
    const container = document.createElement('i')

    const COLOR_MAP: { [key: string]: RegExp } = {}
    let key
    for (key in COLOR) {
      COLOR_MAP[key] = new RegExp(
        '\\$color' + key[0].toUpperCase() + key.substring(1) + '(?!\\w)',
        'g'
      )
    }

    let svg
    const updateSvg = () => {
      let svgData = res.default
      let key
      for (key in COLOR_MAP) {
        svgData = svgData.replace(COLOR_MAP[key], COLOR[key])
      }

      if (svg) {
        svg.innerHTML = svgData
      } else {
        container.innerHTML =
          '<svg aria-hidden=true style=position:absolute;width:0;height:0;overflow:hidden>' +
          svgData +
          '</svg>'
        svg = container.firstChild
      }
    }

    updateSvg()
    document.querySelector('html').insertBefore(svg, document.body)
    loadingState.value = 1
    on(process.env.SKIN_FIELD, updateSvg)
  })
  .catch(err => {
    console.error(err)
    loadingState.value = 2
  })

function isSymbol(id: string) {
  return document.getElementById(id) // symbol 只保留不能字体图标呈现的, 比如带颜色等的

  // const svg = document.getElementById(id)
  // // 完整版应过滤更多元素与属性 https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element
  // if (svg && (
  //   svg.querySelector('style') ||
  //   svg.querySelector('stop') ||
  //   svg.querySelector('[fill]')
  // )) {
  //   return true
  // }
}

/** <Icon icon="i-shibai" size="16px" />
 * emit: (事件名: [参数列表, ...])
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    /** 字体图标, 与imgIcon(优先)二选一 */
    icon: { type: String, default: '' },
    /** 图片图标(svg/png...) */
    imgIcon: { type: String, default: '' },
    /** 字体大小 */
    size: { type: String, default: '' },
  },
  computed: {
    style() {
      const size = this.size
      const result = REG_NUM.exec(size)
      if (!result || !result.length) {
        return ''
      }

      return `width:${size};height:${size};vertical-align:-${0.15 * +result[1] +
        result[2]}`
    },
  },
  // see: https://github.com/vuejs/jsx
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(h: CreateElement) {
    const size = this.size
    const STYLE = this.$style

    const imgIcon = this.imgIcon
    if (imgIcon) {
      return (
        <img
          width={size}
          height={size}
          src={imgIcon}
          class={STYLE.i + ' ' + STYLE.img}
        />
      )
    }

    let icon = this.icon
    switch (loadingState.value) {
      case 1:
        if (isSymbol(icon)) {
          return (
            <svg class={STYLE.svg + ' ' + STYLE.i} style={this.style}>
              {h('use', { attrs: { 'xlink:href': '#' + icon } })}
            </svg>
          )
        }
        break
      case 2:
        if (isSymbol(icon)) {
          return
        }
        break
      default:
        icon = 'el-icon-loading'
    }
    return <i class={icon + ' ' + STYLE.i} style={'font-size:' + size} />
  },
}
</script>

<style lang="scss" module>
.i {
  display: inline-block;
  overflow: hidden;
}

.img {
  background-size: cover;
}

.svg {
  width: 1rem;
  height: 1rem;
  vertical-align: -0.15rem;
  fill: currentColor;
}
</style>
