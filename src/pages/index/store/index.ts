/*
 * @Description: 状态管理入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-28 17:33:31
 */
import Vuex from 'vuex'
import { IUser } from './modules/user'

/** 全局状态
 */
export interface IRootState {
  user: IUser
}

// 先声明空 Store 再动态注册
export default new Vuex.Store<IRootState>({})
