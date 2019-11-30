/*
 * @Description: vender chunks重命名,避免文件名过长,命名映射:build/fileName.log
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:31:14
 */
const updateJSON = require('./updateJSON')
const shortString = require('./shortString')

/** 重命名 vender chunks (命名映射:build/fileName.log)
 *    vendors.main.other.user.d0ae3f07.77d.js => v.wzS.d0ae3f07.77d.js
 * @param {String} des 缩写描述
 * @param {Object} DIC 缩写字典 eg: { index: 'i' }
 *
 * @returns {Function} 缩写函数
 */
module.exports = function(des = '', DIC = {}) {
  const short = shortString(DIC)// 字符串缩写函数
  process.on('beforeExit', () => updateJSON('build/fileName.log', des, DIC))

  /** 重命名 vender chunks (命名映射:build/fileName.log)
   *    vendors.main.other.user.d0ae3f07.77d.js => v.wzS.d0ae3f07.77d.js
   * @param {WebpackModule} module webpack模块
   */
  const rename = module => {
    let name = '_' // 前缀
    for (const chunk of module.chunksIterable) {
      name += short(chunk.name)
    }

    // 又过时
    // module.forEachChunk(chunk => (name += short(chunk.name)))
    // 过时
    // for (const chunk of module.chunks) {
    //   name += short(chunk.name)
    // }

    return name
  }

  rename.get = short
  return rename
}
