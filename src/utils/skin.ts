// 皮肤工具
import Vue from 'vue'

/** 默认皮肤
 */
const DEFAULT = process.env.THEME
/** 当前皮肤
 */
let theme = DEFAULT

let state = {}
Object.defineProperty(state, 'value', {
  get: () => theme,
  set(skin = DEFAULT) {
    for (let dom of document.querySelectorAll<HTMLLinkElement>('link[title]')) {
      dom.disabled = dom.title !== skin
    }
    theme = skin
  },
})
state = Vue.observable(state)
// 放全局去【弃】
// window[process.env.THEME_FIELD] = state as any
// window[process.env.THEME_FIELD].value = 'dark'
// console.log('当前主题名', window[process.env.THEME_FIELD].value)

export default state as { value: string }
