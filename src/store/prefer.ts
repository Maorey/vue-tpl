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
function setSkin(skin?: string) {
  let dom: any
  for (dom of document.querySelectorAll('link[title]')) {
    dom.disabled = dom.title !== skin
  }
}
PREFER.skin && setSkin(PREFER.skin)

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
  skin = (PREFER.skin as string) || DEFAULT_SKIN
  lang = PREFER.lang as string

  @Mutation
  protected SKIN(skin: string = DEFAULT_SKIN) {
    setSkin(skin)
    this.skin = PREFER.skin = skin
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
    this.context.commit('SKIN', skin)
  }
  /** 设置语言
   * @param {String} lang 语言
   */
  @Action
  setLang(lang: string) {
    this.context.commit('LANG', lang)
  }
}

/** 关闭窗口前写入本地
 */
window.addEventListener('beforeunload', () => {
  local.set(CONFIG.prefer, PREFER)
})

export { Prefer as default, IPrefer }
