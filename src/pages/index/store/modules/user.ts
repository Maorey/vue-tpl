/*
 * @Description: 用户状态管理（所有页面通用）
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:16:19
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-28 17:32:00
 */
import { Module } from 'vuex-module-decorators'
import RootUser, { IUser } from '@/store/user'
import store from '..'

@Module({ dynamic: true, store, name: 'user' })
class User extends RootUser {}

export default User
export { IUser }
