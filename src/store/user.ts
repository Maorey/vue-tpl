/*
 * @Description: 用户状态管理（所有页面通用）
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:16:19
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-27 11:23:39
 */
import {
  VuexModule,
  Module,
  MutationAction,
  Action,
  Mutation,
  getModule,
} from 'vuex-module-decorators'
import { IUser } from '@/types/user'

import { get, post } from '@/utils/ajax'
import { cookie } from '@/utils/cookie'
import { local } from '@/utils/storage'

import { API } from '@/api/user'

// 加密算法(token + RSA 加密)
import Jsencrypt from 'jsencrypt'
import md5 from 'crypto-js/md5'

const LOCAL_KEY: string = 'screen_user' // 本地存储的KEY
let publicKey: string // rsa加密公匙

/// 【数据仓库】 ///
interface IState {
  user: IUser | null // 用户信息
  verify: string // 验证码
  message: string // 显示错误信息
}
const state: State = {
  user: (cookie.get() && local.get(LOCAL_KEY)) || null,
  verify: '',
  message: '',
}

/// 【读取数据接口】 ///
interface IGetters {
  user(store: IState): IUser // 获取用户信息
  verify(store: IState): string // 获取验证码
  message(store: IState): string // 获取错误信息
}
const getters: IGetters = {
  user(store: IState) {
    return store.user
  },
  verify(store: IState) {
    return store.verify
  },
  message(store: IState) {
    return store.message
  },
}

/// 【提交数据接口】 ///
interface
const mutations = {
  /** 提交用户信息
   * @param {Object} info 用户信息
   */
  USER(state, info) {
    state.user = info
    local.set(LOCAL_KEY, info)
  },
  /** 提交验证码
   * @param {String} str 验证码
   */
  VERIFY(state, str) {
    state.verify = str
  },
  /** 提交错误消息
   * @param {String} message 消息
   */
  MESSAGE(state, message) {
    state.message = message
  },
}

export const user: Store = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
