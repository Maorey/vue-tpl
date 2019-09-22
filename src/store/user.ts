/* 用户状态管理
 */
import { VuexModule, Action, Mutation } from 'vuex-module-decorators'

import { get as getCookie, set as setCookie } from '@/utils/cookie'
import { ILogin, login, logout } from '@/api/user'
import { local } from '@/utils/storage'
import CONFIG from '@/config'

/** 本地存储的用户信息
 */
const USER_INFO = local.get(CONFIG.token) || {}

/** 用户信息
 */
interface IInfo {
  name: string
  avatar: string
  // ***
}
/** 用户管理
 */
interface IUser {
  token: string
  /** 用户信息
   */
  info?: IInfo
  /** 用户菜单访问权限
   */
  access?: string[]
}

/** 用户状态管理
 */
class User extends VuexModule implements IUser {
  /// State & Getter(public) ///
  token = getCookie(CONFIG.token)
  info = USER_INFO.info as IInfo | undefined
  access = USER_INFO.access as string[] | undefined

  /// Mutation 无法调用/commit 必须通过Action ///
  @Mutation
  protected TOKEN(token: string) {
    this.token = token
    setCookie(CONFIG.token, token, CONFIG.tokenAlive)
  }
  @Mutation
  protected INFO(info?: IInfo) {
    this.info = USER_INFO.info = info
  }
  @Mutation
  protected ACCESS(access?: string[]) {
    this.access = USER_INFO.access = access
  }

  /// Action ///
  /** 登陆
   * @param {ILogin} formData 登陆表单
   */
  @Action
  async login(formData: ILogin) {
    const { data } = await login(formData)

    const context = this.context
    context.commit('TOKEN', data.token)
    context.commit('INFO', data.user)
    context.commit('ACCESS', data.access)
  }
  /** 注销
   */
  @Action
  async logout() {
    await logout()

    const context = this.context
    context.commit('TOKEN', '')
    context.commit('INFO')
    context.commit('ACCESS')
  }

  // 修改...
}

/** 关闭窗口前写入本地
 */
window.addEventListener('beforeunload', () => {
  local.set(CONFIG.token, USER_INFO)
})

export { User as default, IUser }
