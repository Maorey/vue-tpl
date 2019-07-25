/*
 * @Description: 开发服务器代理设置
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:27:34
 */

/** 获取开发服务器代理设置
 *
 * @param {Object} environment 环境变量
 */
module.exports = function(environment) {
  const TARGET = 'PROXY_TARGET'
  const REG_PROXY = /^BASE_URL(\d*)$/

  let proxyList = {}

  let tmp
  for (let key in environment) {
    tmp = REG_PROXY.exec(key)
    if (tmp) {
      key = environment[key]
      proxyList[key] = {
        target: environment[TARGET + tmp[1]],
        changeOrigin: true,
        pathRewrite: url => url.replace(new RegExp(`^/${key}(/.*)?$`), '$1'),
      }
    }
  }

  return {
    // lint
    overlay: { errors: true },
    port: environment.DEV_SERVER_PORT,
    host: environment.DEV_SERVER_HOST,
    proxy: proxyList,
  }
}
