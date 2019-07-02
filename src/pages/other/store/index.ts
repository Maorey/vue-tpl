/*
 * @Description: 状态管理入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-02 11:26:53
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { IUser } from './modules/user'

Vue.use(Vuex) // 只能全局注册

/** 全局状态【若使用 Namespaced Modules, 属性名必须和 name 一致】
 */
export interface IRootState {
  user: IUser
}

// 先声明空 Store 再动态注册
export default new Vuex.Store<IRootState>({})
