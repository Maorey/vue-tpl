/*
 * @description: 得到字符串唯一缩写
 * @Author: 毛瑞
 * @Date: 2019-03-04 09:42:36
 */

/** 缩写字符串为一个字母（52个）
 * 大写：[65, 90]; 小写：[97, 122]
 * @param {String|Number} str 待缩写字符串或码值和
 * @param {Number} code 起始累加数值
 *
 * @returns {String} 一个字符
 */
// function getChar(str, code = 0) {
//   if (typeof str === 'number') {
//     code += str
//   } else {
//     let index = str.length
//     while (index--) {
//       code += index + str.charCodeAt(index)
//     }
//   }

//   do {
//     code = (code + 61) % 123
//   } while (code < 65)

//   code > 90 && code < 97 && (code += code < 94 ? -3 : 3)

//   return String.fromCharCode(code)
// }

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

// const TRIAL = 8 // 重名重试次数
/** 获得唯一缩写（耗时线性增涨，特别是在3个字母(140608个唯一值)及之后）
 * @param {Object} DIC 命名字典
 * @param {String} char 缩写
 * @param {String} str 当前缩写
 * @param {Number} i 调用次数
 *
 * @returns {String} DIC里唯一的缩写
 */
// function getUnique(DIC, char, str = '', i = 0) {
//   const code = str + char // 当前缩写
//   let unique = true
//   // 查重
//   for (const att in DIC) {
//     if (DIC[att] === code) {
//       unique = false
//       if (++i > TRIAL) {
//         str += char
//         i = 0
//       }
//       break
//     }
//   }

//   if (unique) {
//     return code
//   }

//   return getUnique(DIC, getChar(char, i), str, i) // 尾递归
// }

/** 累加字符串数字和
 * @param {String|Number} str 待缩写字符串或码值和
 * @param {Number} code 起始累加数值
 *
 * @returns {Number} 字符串数字和
 */
// function countStr(str, code = 0) {
//   if (typeof str === 'number') {
//     code += str
//   } else {
//     let index = str.length
//     while (index--) {
//       code += index + str.charCodeAt(index)
//     }
//   }

//   return code
// }
/** 获得字符串唯一缩写(转36进制)
 * @param {Object} DIC 命名字典
 * @param {String|Number} str 待缩写字符串
 *
 * @returns {String} DIC里唯一的缩写
 */
// function shortStr(DIC, str) {
//   let count
//   if (typeof str === 'number') {
//     count = str
//     str = str.toString(36)
//   } else {
//     count = countStr(str)
//     str = count.toString(36)
//   }

//   let key
//   for (key in DIC) {
//     if (DIC[key] === str) {
//       key = 0 // 兼职
//       break
//     }
//   }

//   return key !== 0 ? str : shortStr(DIC, ++count)
// }

const CHAR = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const RADIX = CHAR.length
/** 数字转RADIX进制字符串
 * @param {Number} number 10进制数字
 *
 * @returns {String} RADIX进制字符串
 */
function toRadix(number) {
  let str = ''
  do {
    str = CHAR[number % RADIX] + str
    number = (number / RADIX) | 0
  } while (number)

  return str
}

function duplicate(name, DIC) {
  for (const key in DIC) {
    if (name === DIC[key]) {
      return true
    }
  }
  return false
}

/** 获取唯一字符串缩写方法
 * @param {Object} DIC 命名字典，用于去重
 * 【优化】 按码值总和区间分成多个字典 暂无必要
 * @param {Function} callback 获取到新的缩写时执行的回调
 *
 * @returns {(name:String) => String} 返回唯一字符串缩写的方法
 */
module.exports = function(DIC = {}, callback) {
  let counter = 0 // 因build有序

  return name => {
    let n = DIC[(name = String(name))]
    if (!n) {
      // 查重
      while (duplicate((n = toRadix(counter++)), DIC)) {}
      DIC[name] = n
      callback && callback(name, n)
    }

    return n
  }
}
