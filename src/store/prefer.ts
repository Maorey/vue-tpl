/** 偏好管理
 */
import { VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { local } from '@/utils/storage'
import CONFIG from '@/config'

/** 默认皮肤
 */
const DEFAULT_SKIN = 'default'
/** 本地存储的用户信息
 */
const PREFER = local.get(CONFIG.prefer) || {}
/** 切换皮肤
 * @param {String} skin 皮肤名
 */
function setSkin(skin: string = DEFAULT_SKIN) {
  let dom: any
  for (dom of document.querySelectorAll('link[title]')) {
    dom.disabled = dom.title !== skin
  }
  PREFER.skin = skin
}
/** 关闭窗口前写入本地
 */
window.addEventListener('beforeunload', () => {
  local.set(CONFIG.prefer, PREFER)
})

setSkin(PREFER.skin) // 初始皮肤
Object.defineProperty(window, process.env.THEME_FIELD, {
  get: () => PREFER.skin,
  set: setSkin,
}) // 响应式皮肤全局变量

/** 偏好管理
 */
interface IPrefer {
  /** 皮肤
   */
  skin: string
  /** 语言
   */
  lang: string

  // ...
}

/** 偏好管理
 */
class Prefer extends VuexModule implements IPrefer {
  lang = PREFER.lang as string
  get skin() {
    return PREFER.skin as string
  }

  @Mutation
  protected LANG(lang: string) {
    this.lang = PREFER.lang = lang
  }

  /** 设置皮肤
   * @param {String} skin 皮肤名
   */
  @Action
  setSkin(skin: string) {
    setSkin(skin)
  }
  /** 设置语言
   * @param {String} lang 语言
   */
  @Action
  setLang(lang: string) {
    this.context.commit('LANG', lang)
  }
}

export { Prefer as default, IPrefer }
