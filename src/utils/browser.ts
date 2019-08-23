/*
 * @description: 获取当前浏览器类型（type）及版本（version）
 * @Author: 毛瑞
 * @Date: 2018-12-29 11:32:52
 */
const BROWSERS = [
  {
    n: 'chrome',
    N: 'Chrome',
  },
  {
    n: 'firefox',
    N: 'Firefox',
  },
  {
    n: 'opera',
    N: 'Opera',
  },
  {
    n: '(msie|rv)',
    N: 'IE',
  },
  {
    n: '(Safari|version)',
    N: 'Safari',
  },
]

let type
let version

const userAgent = window.navigator.userAgent.toLowerCase()
let tmp
let item
for (item of BROWSERS) {
  tmp = new RegExp(item.n + '.([\\d.]+)').exec(userAgent)
  if (tmp) {
    type = item.N
    version = tmp[1]
    break
  }
}
// Fix: IE不缓存背景图片
type === 'IE' && document.execCommand('BackgroundImageCache', false, 'true')

export { type, version }
