/* 用户状态管理
 */
import { VuexModule, Action, Mutation } from 'vuex-module-decorators'

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
export interface IUser {
  /** 用户信息
   */
  info?: IInfo
  /** 用户菜单访问权限
   */
  menu?: string[]
}

/** 用户状态管理
 */
class User extends VuexModule implements IUser {
  /// State & Getter(public) ///
  info = USER_INFO.info as IInfo | undefined
  menu = USER_INFO.menu as string[] | undefined

  /// Mutation 无法调用/commit 必须通过Action ///
  @Mutation
  protected INFO(info?: IInfo) {
    this.info = USER_INFO.info = info
  }

  @Mutation
  protected MENU(menu?: string[]) {
    this.menu = USER_INFO.menu = menu
  }

  /// Action ///
  /** 登陆
   * @param {ILogin} formData 登陆表单
   */
  @Action
  async login(formData: ILogin) {
    const { data } = await login(formData)

    const context = this.context
    context.commit('INFO', data.info)
    context.commit('MENU', data.menu)
    USER_INFO.token = data.token
  }

  /** 注销
   */
  @Action
  async logout() {
    await logout()

    const context = this.context
    context.commit('INFO')
    context.commit('MENU')
    USER_INFO.token = ''
  }

  // 修改...
}

/** 关闭窗口前写入本地
 */
window.addEventListener('beforeunload', () => {
  local.set(CONFIG.token, USER_INFO) // 允许多个标签多个号挺好的
})

export default User
