/** 获取当前浏览器类型（type）及版本（version） */

const userAgent = navigator.userAgent.toLowerCase()
// 有序
const BROWSERS = {
  IE: /(?:msie|trident.*rv).([\d.]+)/,
  Edge: /edge.([\d.]+)/,
  Chrome: /chrome.([\d.]+)/,
  Firefox: /firefox.([\d.]+)/,
  Opera: /opera.([\d.]+)/,
  Safari: /(?:safari|version).([\d.]+)/,
}
type browsers = keyof typeof BROWSERS

/** 浏览器类型 */
let type!: browsers | null
/** 浏览器版本 */
let version!: string | null

for (type in BROWSERS) {
  if ((version = BROWSERS[type as browsers].exec(userAgent) as any)) {
    version = version[1]
    break
  }
}

if (version) {
  // Fix: IE不缓存背景图片
  if (type === 'IE') {
    try {
      document.execCommand('BackgroundImageCache', false, true as any)
    } catch (error) {}
  }
} else {
  type = version = null
}

export { type, version }
