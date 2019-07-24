/*
 * @Description: 用户状态管理
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:16:19
 */
import { Module, getModule } from 'vuex-module-decorators'
import RootUser, { IUser } from '@/store/user'
import store from '../'

@Module({ dynamic: true, store, name: 'user' })
class User extends RootUser {}

/** 用户状态管理
 */
const userModule = getModule(User)

export { userModule as default, IUser }
