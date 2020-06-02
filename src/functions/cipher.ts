/** 加密/解 */
import md5 from 'crypto-js/md5'

import UTF8 from 'crypto-js/enc-utf8'
import Base64 from 'crypto-js/enc-base64'

import AES from 'crypto-js/aes'
import ECB from 'crypto-js/mode-ecb'
import PKCS7 from 'crypto-js/pad-pkcs7'

/** 加密密码
 * @param {string} password 密码
 * @param {string} username 用户名
 *
 * @returns {string} 密文(不可逆)
 */
function pwd(password: string, username: string) {
  return md5(password, username).toString()
}

/** base64加密
 * @param {string} text 文本
 *
 * @returns {string} 密文(可逆)
 */
function encode(text: string) {
  return Base64.stringify(UTF8.parse(text))
}

/** base64解密
 * @param {string} ciphertext 密文
 *
 * @returns {string} 密文(可逆)
 */
function decode(ciphertext: string) {
  return Base64.parse(ciphertext).toString(UTF8)
}

/** AES加密
 * @param {string} text 文本
 * @param {string} key 密匙
 *
 * @returns {string} 密文(可逆)
 */
function encrypt(text: string, key: string) {
  return AES.encrypt(text, key, {
    mode: ECB,
    padding: PKCS7,
  }).toString()
}

/** AES解密
 * @param {string} ciphertext 密文
 * @param {string} key 密匙
 *
 * @returns {string} key 明文
 */
function decrypt(ciphertext: string, key: string) {
  return AES.decrypt(ciphertext, key, {
    mode: ECB,
    padding: PKCS7,
  }).toString(UTF8)
}

export { pwd, encode, decode, encrypt, decrypt }
