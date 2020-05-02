/*
 * @Description: 和dom结构相关的工具
 * @Author: 毛瑞
 * @Date: 2019-07-04 14:38:59
 */

/** 获取目标元素到页面左上角的绝对定位
 * @param {Dom} dom dom对象
 * @param {Boolean} flag undefined: 返回{top,left}; true: 返回top; false: 返回left
 *
 * @returns {Number|{ top: number; left: number } } 见flag
 */
function getOffset(dom: any, flag?: boolean) {
  let top = 0
  let left = 0

  do {
    flag || (left += dom.offsetLeft)
    flag === false || (top += dom.offsetTop)
    dom = dom.offsetParent
  } while (dom)

  return flag === undefined ? { top, left } : flag ? top : left
}

/** html标签信息 */
interface ITag {
  /** 标签名 */
  tagName: string
  /** 标签属性, 比如: class、style... */
  [attributeName: string]: string
}
const IS_EQUAL = (
  item: ITag,
  tagName: string,
  attributeName: string,
  value: string
) =>
  (!tagName || tagName === item.tagName) &&
  (attributeName
    ? value
      ? value === item[attributeName]
      : item[attributeName] !== undefined
    : Object.values(item).includes(value))
/** 扩展数组方法 */
class HtmlInfo extends Array<ITag> {
  /** 获取满足条件的信息
   * @param {String} tagName 标签名 省略查找全部
   * @param {String} attributeName 属性名
   * @param {String} value 属性值
   * @param {Function} compare 比较方法
   *
   * @returns {ITag|void} 标签信息|undefined
   */
  get(
    tagName = '',
    attributeName = '',
    value = '',
    compare: (
      item: ITag,
      tagName: string,
      attributeName: string,
      value: string
    ) => boolean | void = IS_EQUAL
  ) {
    tagName = tagName.trim()
    attributeName = attributeName.trim()
    value = value.trim()

    let item: ITag
    let i = this.length
    while (i--) {
      item = this[i]
      if (compare(item, tagName, attributeName, value)) {
        return item
      }
    }
  }
}
/** 全部html标签属性 */
const REG_ATTS = /<\s*(\w+)(.*?)\s*\/?>/g
/** html标签属性 */
const REG_ATT = /([\w|-]+)(?:\s*=\s*["|'](.*?)["|'])?/g
/** 获取html字符串中标签属性（比如 style）
 *    建文档树啥的就算了
 * @test true
 *
 * @param {String} html html 字符串
 *
 * @returns {HtmlInfo} 标签信息
 */
function getInfoByHtml(html: string): HtmlInfo {
  // html.match(/style="(.+?)"/g)
  // 提取标签 <tag ...attributes /?>
  // arguments: match g1(标签) (g2 (att="") g3(att) g4(val))n index html
  // 即 att 是 i % 3 === 0;val 是 att + 1
  // 【一个正则搞不定，分组里属性名、属性值只会保留最后一个的，不会是上面的效果...】
  // const reg = /<\s*(\w+)(\s+(\w+)="(.+?)")*\s*\/?>/g

  // 先提取全部属性即<tag ...attributes /?> 中间的atts字符串
  // 分组 tag attributes
  // const reg = /<\s*(\w+)(.*?)\s*\/?>/g

  // 提取属性
  // 可以有-（比如 data-id）\w=[A-Za-z0-9_]
  // 分组：att val (?:的分组会忽略，支持空属性，比如disabled、checked等)
  // const REG_ATTS = /([\w|-]+)(?:\s*=\s*["|'](.*?)["|'])?/g

  const htmlInfo: HtmlInfo = new HtmlInfo()

  html = html.trim()
  if (!html) {
    return htmlInfo
  }

  let result: string[] | null // 正则匹配的结果或临时变量
  // let match; // 匹配的字符串
  let tagName: string // 标签名
  let attributes: string // 标签属性集合字符串
  // let index; // 配置开始索引
  let info: ITag // 提取结果
  while ((result = REG_ATTS.exec(html))) {
    // match = result[0]
    tagName = result[1]
    attributes = result[2]
    // index = result[3]

    info = {
      // __start: index, // 标签起始位置在原字符中的位置
      tagName, // 标签名
    }

    // 提取属性 分组：属性值 属性名
    if (attributes) {
      while ((result = REG_ATT.exec(attributes))) {
        // 空属性等于自身,比如 disabled、checked等
        // 呃，某些自定义的空属性也这么搞吧...
        info[result[1]] = result[2] || result[1]
      }
    }

    // // 提取内容 innerHTML
    // index += match.length // 内容开始位置
    // // 标签结束位置 <input/>好说 <div><div></div></div> ... 不好搞啊
    // info.__end = ...

    htmlInfo.push(info)
  }

  // html.replace(reg, function(match, tagName, attributes, index) {
  //   let info = {
  //     tagName, // 标签名
  //     __start: index, // 标签起始位置在原字符中的位置
  //   }
  //   // 提取属性
  //   if (attributes) {
  //     // 属性
  //     attributes.replace(REG_ATTS, function(m, att, val) {
  //       // 空属性等于自身,比如 disabled、checked等
  //       // 呃，某些自定义的空属性也这么搞吧...
  //       att && (info[att] = val === undefined ? att : val)
  //     })
  //   }
  //   // 提取内容
  //   let start = index + match.length
  //   // 查找结束标签 不管有空格的了
  //   // 如果是单标签...不管就酱吧
  //   let end = html.indexOf('</' + tagName + '>', start)
  //   end > start && (info.innerHTML = html.substring(start, end))
  //   // 标签在原字符串结束位置
  //   info.__end = end > start ? end + tagName.length + 3 : start

  //   htmlInfo.push(info)
  // })

  return htmlInfo
}

const REG_TAGS = /<\/?\s*(\w+).*?\/?>/gi
// 标签黑名单
const TAGS = ['html', 'head', 'meta', 'body', 'link', 'script']
const REPLACE_TAG = (match: string, tag: string) =>
  TAGS.includes(tag.toLowerCase())
    ? `&lt;${match.substring(1, match.length - 1)}&gt;`
    : match
/** 转义html字符串 防注入【只过滤标签】 html转义字符&不管
 *    xss:https://jsxss.com 大小28k+
 * @test true
 *
 * @param {String} html
 */
function escapeHTML(html: string) {
  html = html.trim()
  if (!html) {
    return html
  }

  // 提取标签 换掉首尾尖括号 img:src a:href css:background-image ...
  return html.replace(REG_TAGS, REPLACE_TAG)
}

export { getOffset, getInfoByHtml, escapeHTML, HtmlInfo }
