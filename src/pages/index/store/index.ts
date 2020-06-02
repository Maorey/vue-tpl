/*
 * @Description: 状态管理入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { IPrefer } from './modules/prefer'

Vue.use(Vuex) // 只能全局注册

/** 全局状态【若使用 Namespaced Modules, 属性名必须和 name 一致】
 *    先声明空 Store 再动态注册
 */
export default new Vuex.Store<{
  prefer: IPrefer
}>({})
