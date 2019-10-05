/*
 * @Description: vender chunks重命名,避免文件名过长,命名映射:build/fileName.map
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:31:14
 */
const updateJSON = require('./updateJSON')
const shortString = require('./shortString')

/** 重命名 vender chunks (命名映射:build/fileName.map)
 *    vendors.main.other.user.d0ae3f07.77d.js => v.wzS.d0ae3f07.77d.js
 * @param {String} des 缩写描述
 * @param {Object} DIC 缩写字典 eg: { index: 'i' }
 *
 * @returns {Function} 缩写函数
 */
module.exports = function(des = '', DIC = {}) {
  let record // 命名缩写记录
  // 字符串缩写函数
  const short = shortString(DIC, (name, n) => {
    if (!record) {
      record = {}
      setTimeout(() => updateJSON('build/fileName.map', des, record))
    }

    record[n] = name
  })

  /** 重命名 vender chunks (命名映射:build/fileName.map)
   *    vendors.main.other.user.d0ae3f07.77d.js => v.wzS.d0ae3f07.77d.js
   * @param {WebpackModule} module webpack模块
   */
  return module => {
    let name = '_' // 前缀
    for (let chunk of module.chunksIterable) {
      name += short(chunk.name)
    }

    // 又过时
    // module.forEachChunk(chunk => (name += short(chunk.name)))
    // 过时
    // for (let item of module.chunks) {
    //   name += short(chunk.name)
    // }

    return name
  }
}
