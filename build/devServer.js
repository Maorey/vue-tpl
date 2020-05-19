/** 获取开发服务器代理设置
 * @param {Object} ENV 环境变量
 * @param {String[]} PAGES SPA名字
 */
module.exports = function(ENV, PAGES) {
  const PORT = 9000
  const HOST = '0.0.0.0'
  const TARGET = 'PROXY_TARGET'
  const FIELD = ENV.PROXY_FIELD
  const REG_BASE = /^BASE_PATH(\d*)$/
  const REG_URL = /^((?:http|ws)s?:\/\/)[^:/]+(.*)$/

  const removeField = (url, field) =>
    url.replace(
      new RegExp(`([?&])${field}(?:=[^&]+)?(&)?`),
      (match, left, right) => (left === '?' ? (right ? left : '') : right || '')
    )

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
  for (let key in ENV) {
    let target = REG_BASE.exec(key)
    if (target) {
      let proxyField = target[1]
      REG_URL.test((target = ENV[TARGET + proxyField])) ||
        (target = `http${https ? 's' : ''}://${host}:${port}/${target}`)
      key = ENV[key]
      proxy || (proxy = {})
      proxyField = FIELD + proxyField
      const REG = new RegExp(`^/?${key}([/?].+)?$`)
      proxy[key] = {
        target,
        changeOrigin: true,
        pathRewrite: url => url.replace(REG, '$1'),
        router(req) {
          let proxyAddress = req.query[proxyField]
          if (proxyAddress) {
            delete req.query[proxyField]
            req.url = removeField(req.url, proxyField)
            req.originalUrl = removeField(req.originalUrl, proxyField)

            ENV[proxyAddress] && (proxyAddress = ENV[proxyAddress])
            return REG_URL.test(proxyAddress)
              ? proxyAddress
              : target.replace(REG_URL, `$1${proxyAddress}$2`)
          }
          return target
        },
      }
    }
  }

  // http2 应该是不能配置了
  const REG_SPA = /^\/([^/]+)(.*)$/
  const REG_HTML = /\.html$/
  const REG_FILES = /[^/]+\.[^/]+$/
  const REG_PATH = /^(?:http|ws)s?:\/\/[^/]+(.*)$/
  const REG_SLASHES = /\/+/
  return {
    host,
    port,
    https,
    proxy,
    clientLogLevel: 'warn',
    overlay: { errors: true }, // lint
    openPage: ENV.DEV_SERVER_PAGE || '',
    historyApiFallback: {
      // index: '/index.html',
      rewrites: [
        {
          // SPA可省略.html 支持history路由(路径不能有'.', 因为用REG_FILES匹配文件)
          from: /./,
          to(context) {
            const parsedUrl = context.parsedUrl
            const search = parsedUrl.search || ''
            let pathname = REG_SPA.exec(parsedUrl.pathname)

            const entry = pathname[1].replace(REG_HTML, '')
            if (PAGES[entry]) {
              pathname = pathname[2]
              if (REG_FILES.test(pathname)) {
                let referer = context.request.headers.referer
                if (referer) {
                  pathname = parsedUrl.pathname.split(REG_SLASHES)
                  referer = referer.replace(REG_PATH, '$1').split(REG_SLASHES)
                  while (pathname[0] === referer[0]) {
                    pathname.shift()
                    referer.shift()
                  }
                  return '/' + pathname.join('/') + search
                }
                return pathname + search
              }
              return `/${entry}.html${search}`
            }
            return parsedUrl.pathname + search
          },
        },
      ],
    },
  }
}
