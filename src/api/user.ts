/*
 * @Description: 与用户模块交互
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:55:50
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-28 17:13:44
 */
import { get, post } from '@/utils/ajax'
import API from './config/user'

// 加密算法(token + RSA 加密)
import Jsencrypt from 'jsencrypt'
import md5 from 'crypto-js/md5'

let publicKey: string // rsa加密公匙

/** 获取验证码(及publicKey)
 *
 * @returns {Promise}
 */
function getVerify(): Promise<any> {
  return get(API.verify).then((res: any) => {
    publicKey = res.sign
    return res
  })
}

/** 登陆表单
 */
interface ILogin {
  verify: string
  account: string
  password: string
}
/** 登陆
 * @param {ILogin} formData 登陆表单
 *
 * @returns {Promise}
 */
function login(formData: ILogin): Promise<any> {
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
  })
}

/** 注销
 *
 * @returns {Promise}
 */
function logout(): Promise<any> {
  return get(API.logout)
}

// 用户信息修改...

export { ILogin, getVerify, login, logout }
