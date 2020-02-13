/** 偏好管理
 */
import { VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { local } from '@/utils/storage'
import { set } from '@/utils/skin'
import CONFIG from '@/config'

/** 本地存储的偏好信息
 */
const PREFER = local.get(CONFIG.prefer) || {}

/** 偏好管理
 */
export interface IPrefer {
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
  /// State & Getter(public) ///
  lang = (PREFER.lang || 'zh') as string
  skin = (PREFER.skin = set(PREFER.skin))

  /// Mutation 无法调用/commit 必须通过Action ///
  @Mutation
  protected LANG(lang: string) {
    this.lang = PREFER.lang = lang
  }

  @Mutation
  protected SKIN(skin: string) {
    this.skin = PREFER.skin = set(skin)
  }

  /// Action ///
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
  setLang(lang = 'zh') {
    this.context.commit('LANG', lang)
  }
}

/** 关闭窗口前写入本地
 */
window.addEventListener('beforeunload', () => {
  local.set(CONFIG.prefer, PREFER)
})

export default Prefer
