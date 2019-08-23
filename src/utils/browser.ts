/*
 * @description: 获取当前浏览器类型（type）及版本（version）
 * @Author: 毛瑞
 * @Date: 2018-12-29 11:32:52
 */

const userAgent = navigator.userAgent.toLowerCase()
const REG_VERSION = '.([\\d.]+)'
const BROWSERS = [
  {
    r: '(?:msie|trident.*rv)',
    n: 'IE',
  },
  {
    r: 'edge',
    n: 'Edge',
  },
  {
    r: 'chrome',
    n: 'Chrome',
  },
  {
    r: 'firefox',
    n: 'Firefox',
  },
  {
    r: 'opera',
    n: 'Opera',
  },
  {
    r: '(?:Safari|version)',
    n: 'Safari',
  },
]

let type
let version

let temp
let item
for (temp in BROWSERS) {
  item = BROWSERS[temp]
  temp = new RegExp(item.r + REG_VERSION).exec(userAgent)

  if (temp) {
    type = item.n
    version = temp[1]
    break
  }
}

// Fix: IE不缓存背景图片
type === 'IE' && document.execCommand('BackgroundImageCache', false, 'true')

export { type, version }
