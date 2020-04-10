/** 为页面添加横幅
 * @param ENV 环境变量
 * @param config chainWebpack
 */
module.exports = ENV =>
  `console.log('%cbuild: ${ENV.APP_VERSION}-${String(Date.now()).substr(
    -11,
    5
  )}','background:green;color:white');` // build 信息(时间戳年~时)
