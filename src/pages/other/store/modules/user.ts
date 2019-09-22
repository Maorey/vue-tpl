/*
 * @Description: 用户状态管理
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:16:19
 */
import { Module, getModule } from 'vuex-module-decorators'
import RootUser, { IUser } from '@/store/user'
import store from '../'

@Module({ dynamic: true, namespaced: true, name: 'user', store })
class User extends RootUser {}

export default getModule(User)
export { IUser }
