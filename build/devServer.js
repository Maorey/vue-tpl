/*
 * @Description: 开发服务器代理设置
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:27:34
 */
const PORT = 9000
const HOST = '0.0.0.0'
const TARGET = 'PROXY_TARGET'
const REG_PROXY = /^BASE_PATH(\d*)$/
const REG_RELATIVE = /^(?:http|ws)s?:\/\//

/** 获取开发服务器代理设置
 *
 * @param {Object} ENV 环境变量
 */
module.exports = function(ENV) {
  const https = !!ENV.DEV_SERVER_HTTPS
  const port = ENV.DEV_SERVER_PORT || PORT
  let host = ENV.DEV_SERVER_HOST
  if (!host || host === HOST) {
    host = ''
    try {
      const network = require('os').networkInterfaces()
      const family = ENV.DEV_SERVER_NETWORK || 'IPv4'
      for (const key in network) {
        for (const item of network[key]) {
          if (!item.internal && family === item.family) {
            host = item.address
            break
          }
        }
        if (host) {
          break
        }
      }
    } catch (e) {}
    host || (host = HOST)
  }
  let proxy

  let key
  let target
  for (key in ENV) {
    target = REG_PROXY.exec(key)
    if (target) {
      REG_RELATIVE.test((target = ENV[TARGET + target[1]])) ||
        (target = `http${https ? 's' : ''}://${host}:${port}/${target}`)
      key = ENV[key]
      proxy || (proxy = {})
      const REG = new RegExp(`^/?${key}([/?].+)?$`)
      proxy[key] = {
        target,
        changeOrigin: true,
        pathRewrite: url => url.replace(REG, '$1'),
      }
    }
  }

  // http2 应该是不能配置了
  return {
    host,
    port,
    https,
    proxy,
    clientLogLevel: 'warn',
    overlay: { errors: true }, // lint
    openPage: ENV.DEV_SERVER_PAGE || '',
  }
}
