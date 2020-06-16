/*
 * @Description: 与用户模块交互
 * @Author: 毛瑞
 * @LastEditTime: 2019-07-24 11:01:36
 */
import { setHEAD, get, post } from '@/utils/ajax'
import { local } from '@/utils/storage'
import CONFIG from '@/config'
import { STORAGE, AUTH } from '@/enums'

// 加密算法(token + RSA 加密)
import Jsencrypt from 'jsencrypt'
import md5 from 'crypto-js/md5'

/** 用户登录相关接口 */
export const enum API {
  /** 获取登录验证码 */
  verify = 'verify',
  /** 用户登录 */
  login = 'login',
  /** 用户注销登录 */
  logout = 'logout',
}

/** rsa加密公匙 */
let publicKey: string

/** 获取验证码(及publicKey)
 *
 * @returns {Promise}
 */
function getVerify() {
  return get(API.verify).then((res: any) => {
    publicKey = res.sign
    return res
  })
}

/** 登录表单
 */
export interface Login {
  verify: string
  username: string
  password: string
  remember: boolean
}
/** 登录
 * @param {Login} formData 登录表单
 *
 * @returns {Promise}
 */
function login(formData: Login) {
  const rsa = new Jsencrypt()
  rsa.setPublicKey(publicKey)
  const password = rsa.encrypt(formData.password.trim())
  const username = formData.username.trim()
  const verify = formData.verify.trim()

  return post(API.login, {
    sign: md5(username + password + verify).toString(), // md5签名
    verify,
    username,
    password,
  }).then(res => {
    setHEAD(AUTH.head, res.data.token, true)
    // 加密存token + 进入页面最先检查/设置token
    local.set(STORAGE.me, res.data, CONFIG.tokenAlive)
    return res
  })
}

/** 注销
 *
 * @returns {Promise}
 */
function logout() {
  return get(API.logout).then(res => {
    setHEAD(AUTH.head, '', true)
    local.remove(STORAGE.me)
    return res
  })
}

// 用户信息修改...

export { getVerify, login, logout }
