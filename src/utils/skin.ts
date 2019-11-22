// 皮肤工具
// import Vue from 'vue'

type callback = (skin: string) => void
/** 订阅列表
 */
const subscribes = new Set<callback>()

/** 默认皮肤
 */
const DEFAULT = process.env.THEME
/** 当前皮肤
 */
let theme = DEFAULT

const state = {}
Object.defineProperty(state, 'value', {
  get: () => theme,
  set(skin = DEFAULT) {
    if (skin === theme) {
      return
    }
    for (const dom of document.querySelectorAll<HTMLLinkElement>('link[title]')) {
      dom.disabled = dom.title !== skin
    }
    theme = skin
    // 通知订阅者
    for (const callback of subscribes) {
      callback(skin)
      ;(callback as any).$ && off(callback)
    }
  },
})
// state = Vue.observable(state)
// 放全局去【弃】
// window[process.env.THEME_FIELD] = state as any

/** 订阅皮肤修改
 * @param {Function} callback 回调函数，接受当前皮肤作为参数
 * @param {Boolean} once 是否只订阅一次
 * @param {Boolean} immediate 是否马上执行
 */
function on(callback: callback, once?: boolean, immediate?: boolean) {
  ;(callback as any).$ = once
  subscribes.add(callback)
  immediate && callback(theme)
}
/** 取消订阅
 * @param {Function} callback 回调函数
 */
function off(callback: callback) {
  subscribes.delete(callback)
}

export default state as { value: string }
export { on, off }
