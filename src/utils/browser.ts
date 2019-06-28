/*
 * @description: 获取当前浏览器类型（t）及版本（v）
 * @Author: 毛瑞
 * @Date: 2018-12-29 11:32:52
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-27 18:29:01
 */
const brows = [
  {
    n: 'msie',
    N: 'IE', // t
  },
  {
    n: 'firefox',
    N: 'Firefox', // t
  },
  {
    n: 'chrome',
    N: 'Chrome', // t
  },
  {
    n: 'opera',
    N: 'Opera', // t
  },
  {
    n: 'Safari', // t
    r: 'version',
  },
]
const ag = window.navigator.userAgent.toLowerCase()

let t
let v

let tmp
for (const obj of brows) {
  tmp = new RegExp((obj.r || obj.n) + '.([\\d.]+)').exec(ag)
  if (tmp) {
    t = obj.N || obj.n
    v = tmp[1]
    break
  }
}
t === 'IE' && document.execCommand('BackgroundImageCache', false, 'true') // 修正IE不缓存背景图片

export const type = t
export const version = v
