/*
 * @Description: 与用户模块交互
 * @Author: 毛瑞
 * @LastEditTime: 2019-07-24 11:01:36
 */
import { setHEAD, get, post } from '@/utils/ajax'
import { local } from '@/utils/storage'
import CONFIG from '@/config'
import API from '@/config/api/user'

// 加密算法(token + RSA 加密)
import Jsencrypt from 'jsencrypt'
import md5 from 'crypto-js/md5'

/** rsa加密公匙
 */
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

/** 登陆表单
 */
export interface ILogin {
  verify: string
  account: string
  password: string
  remember: boolean
}
/** 登陆
 * @param {ILogin} formData 登陆表单
 *
 * @returns {Promise}
 */
function login(formData: ILogin) {
  const rsa = new Jsencrypt()
  rsa.setPublicKey(publicKey)
  const password = rsa.encrypt(formData.password.trim())
  const account = formData.account.trim()
  const verify = formData.verify.trim()

  return post(API.login, {
    sign: md5(account + password + verify).toString(), // md5签名
    verify,
    account,
    password,
  }).then(res => {
    setHEAD(CONFIG.token, res.data.token, true)
    // 加密存token + 进入页面最先检查/设置token
    local.set(CONFIG.token, res.data, CONFIG.tokenAlive)
    return res
  })
}

/** 注销
 *
 * @returns {Promise}
 */
function logout() {
  return get(API.logout).then(res => {
    setHEAD(CONFIG.token, '', true)
    local.remove(CONFIG.token)
    return res
  })
}

// 用户信息修改...

export { getVerify, login, logout }
