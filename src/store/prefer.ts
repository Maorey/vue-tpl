/** 偏好管理
 */
import { VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { local } from '@/utils/storage'
import { set } from '@/utils/theme'
import CONFIG from '@/config'

/** 本地存储的偏好信息
 */
const PREFER = local.get(CONFIG.prefer) || {}

/** 偏好管理
 */
interface IPrefer {
  /** 皮肤
   */
  theme: string
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
  theme = (PREFER.theme = set(PREFER.theme))

  /// Mutation 无法调用/commit 必须通过Action ///
  @Mutation
  protected LANG(lang: string) {
    this.lang = PREFER.lang = lang
  }

  @Mutation
  protected THEME(theme: string) {
    this.theme = PREFER.theme = set(theme)
  }

  /// Action ///
  /** 设置皮肤
   * @param {String} theme 皮肤名
   */
  @Action
  setSkin(theme: string) {
    this.context.commit('THEME', theme)
  }

  /** 设置语言
   * @param {String} lang 语言
   */
  @Action
  setLang(lang: string = 'zh') {
    this.context.commit('LANG', lang)
  }
}

/** 关闭窗口前写入本地
 */
window.addEventListener('beforeunload', () => {
  local.set(CONFIG.prefer, PREFER)
})

export { Prefer as default, IPrefer }
