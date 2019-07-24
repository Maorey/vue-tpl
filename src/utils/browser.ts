/*
 * @description: 获取当前浏览器类型（type）及版本（version）
 * @Author: 毛瑞
 * @Date: 2018-12-29 11:32:52
 */
const browsers = [
  {
    n: 'msie',
    N: 'IE',
  },
  {
    n: 'firefox',
    N: 'Firefox',
  },
  {
    n: 'chrome',
    N: 'Chrome',
  },
  {
    n: 'opera',
    N: 'Opera',
  },
  {
    n: 'Safari',
    r: 'version',
  },
]

let type
let version

const userAgent = window.navigator.userAgent.toLowerCase()
let tmp
let item
for (item of browsers) {
  tmp = new RegExp((item.r || item.n) + '.([\\d.]+)').exec(userAgent)
  if (tmp) {
    type = item.N || item.n
    version = tmp[1]
    break
  }
}
// Fix: IE不缓存背景图片
type === 'IE' && document.execCommand('BackgroundImageCache', false, 'true')

export { type, version }
