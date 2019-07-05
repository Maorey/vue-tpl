/*
 * @description: 得到字符串唯一缩写
 * @Author: Maorey
 * @LastEditors: 毛瑞
 * @Date: 2019-03-04 09:42:36
 * @LastEditTime: 2019-07-05 13:23:24
 */

/** 缩写字符串为一个字母（52个）
 * 大写：[65, 90]; 小写：[97, 122]
 * @param {String|Number} str 待缩写字符串或码值和
 * @param {Number} code 起始累加数值
 *
 * @returns {String} 一个字符
 */
function getChar(str, code = 0) {
  if (typeof str === 'number') {
    code += str
  } else {
    // 累加字符串码值
    let idx = str.length
    while (idx--) {
      code += idx + str.charCodeAt(idx)
    }
  }

  // 使在 [65, 122] 区间
  do {
    code = (code + 65) % 123 // 0 - 122
  } while (code < 65)
  // 处理 [91, 96] 区间
  if (code > 90 && code < 97) {
    code += code < 94 ? -3 : 3
  }

  return String.fromCharCode(code)
}

/** 获取随机字符串
 * @param {Number} len 字符串长度 默认3个(52*52*52=140608 个唯一值)
 */
// function getStr(len = 3) {
//   const unique = 58 // 随机58个值（概率不论，刚好可以得到52个不同字母）
//   let str = ''
//   while (len--) {
//     str += getChar(Math.trunc(Math.random() * unique))
//   }

//   return str
// }

const TRIAL = 8 // 重名重试次数
/** 获得唯一缩写（耗时线性增涨，特别是在3个字母(140,608个唯一值)及之后）
 * @param {Object} DIC 命名字典
 * @param {String} char 缩写
 *
 * str: 当前缩写
 * i: 调用次数
 *
 * @returns {String} 唯一缩写
 */
function getUnique(DIC, char, str = '', i = 0) {
  const code = str + char // 当前缩写
  let unique = true // 是否唯一
  // 查字典得唯一
  for (let att in DIC) {
    if (DIC[att] === code) {
      // 与已有命名重复
      unique = false
      if (++i > TRIAL) {
        // 超过尝试次数仍没有唯一缩写则追加一个字母
        str += char
        i = 0
      }
      break
    }
  }

  if (unique) {
    return code
  }

  return getUnique(DIC, getChar(char, i), str, i) // 尾递归
}

/** 获取唯一字符串缩写方法
 * @param {Object} DIC 命名字典，用于去重
 * 【优化】 按码值总和区间分成多个字典 暂无必要
 * @param {Function} callback 获取到新的缩写时执行的回调
 *
 * @returns {String:name => String:shortName} 返回唯一字符串缩写的方法
 */
module.exports = function(DIC = {}, callback) {
  return name => {
    name = String(name)

    let Abbreviation = DIC[name]

    if (!Abbreviation) {
      Abbreviation = DIC[name] = getUnique(DIC, getChar(name))
      callback && callback(name, Abbreviation)
    }

    return Abbreviation
  }
}
