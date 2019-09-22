/*
 * @Description: 偏好管理
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:16:19
 */
import { Module, getModule } from 'vuex-module-decorators'
import RootPrefer, { IPrefer } from '@/store/prefer'
import store from '../'

@Module({ dynamic: true, namespaced: true, name: 'prefer', store })
class Prefer extends RootPrefer {}

export default getModule(Prefer)
export { IPrefer }
