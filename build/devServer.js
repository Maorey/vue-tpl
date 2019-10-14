/*
 * @Description: 开发服务器代理设置
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:27:34
 */

const TARGET = 'PROXY_TARGET'
const REG_PROXY = /^BASE_PATH(\d*)$/
/** 获取开发服务器代理设置
 *
 * @param {Object} ENV 环境变量
 */
module.exports = function(ENV) {
  let proxy

  let tmp
  for (let key in ENV) {
    tmp = REG_PROXY.exec(key)
    if (tmp) {
      key = ENV[key]
      proxy || (proxy = {})
      proxy[key] = {
        target: ENV[TARGET + tmp[1]],
        changeOrigin: true,
        pathRewrite: url => url.replace(new RegExp(`^/${key}(/.*)?$`), '$1'),
      }
    }
  }

  return {
    host: ENV.DEV_SERVER_HOST,
    port: ENV.DEV_SERVER_PORT,
    overlay: { errors: true }, // lint
    proxy,
  }
}
