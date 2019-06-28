/*
 * @Description: 用户状态管理（所有页面通用）
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:16:19
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-28 17:32:23
 */
import { VuexModule, Action, Mutation } from 'vuex-module-decorators'

import { get as getCookie, set as setCookie } from '@/utils/cookie'
import { ILogin, login, logout } from '@/api/user'
import { local } from '@/utils/storage'

const LOCAL_KEY: string = 'vuetpl_user' // 本地存储的KEY
const USER_INFO: IUser = local.get(LOCAL_KEY) as IUser
const TOKEN: string = getCookie(LOCAL_KEY)

/** 偏好
 */
interface IPerfer {
  skin: string
  lang: string
}
/** 用户状态
 */
interface IUser {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  prefer?: IPerfer
}

class User extends VuexModule implements IUser {
  public token = TOKEN || ''
  public name = (TOKEN && USER_INFO.name) || ''
  public avatar = (TOKEN && USER_INFO.avatar) || ''
  public introduction = (TOKEN && USER_INFO.introduction) || ''
  public roles: string[] = (TOKEN && USER_INFO.roles) || []

  /** 登陆
   * @param {ILogin} formData 登陆表单
   */
  @Action
  public async login(formData: ILogin) {
    const { data } = await login(formData)
    this.SET_TOKEN(data.token)
  }

  /** 注销
   */
  @Action
  public async logout() {
    await logout()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
    setCookie(LOCAL_KEY, token, 168) // 7天免登陆
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }
}

export default User
export { IUser }
