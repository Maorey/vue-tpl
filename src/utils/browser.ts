/*
 * @description: 获取当前浏览器类型（type）及版本（version）
 * @Author: 毛瑞
 * @Date: 2018-12-29 11:32:52
 */

const userAgent = navigator.userAgent.toLowerCase()
// 有序
const BROWSERS: IObject<RegExp> = {
  IE: /(?:msie|trident.*rv).([\d.]+)/,
  Edge: /edge.([\d.]+)/,
  Chrome: /chrome.([\d.]+)/,
  Firefox: /firefox.([\d.]+)/,
  Opera: /opera.([\d.]+)/,
  Safari: /(?:safari|version).([\d.]+)/,
}

/** 浏览器类型
 */
let type: string | undefined
/** 浏览器版本
 */
let version: string | undefined

for (type in BROWSERS) {
  version = BROWSERS[type].exec(userAgent) as any

  if (version) {
    version = version[1]
    break
  }
}

if (version) {
  // Fix: IE不缓存背景图片
  type === 'IE' && document.execCommand('BackgroundImageCache', false, 'true')
} else {
  type = version = undefined
}

export { type, version }
