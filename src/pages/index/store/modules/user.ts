/** 用户状态管理
 */
import { Module, getModule } from 'vuex-module-decorators'
import RootUser, { IUser } from '@/store/user'
import store from '../'

@Module({ dynamic: true, namespaced: true, name: 'user', store })
class User extends RootUser {}

export default getModule(User)
export { IUser }
