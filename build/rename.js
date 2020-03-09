/*
 * @Description: vender chunks重命名,避免文件名过长,命名映射:build/~fileName
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:31:14
 */
const updateJSON = require('./updateJSON')
const shortString = require('./shortString')

/** 字典重命名: vendors.main.other.user.d0ae3f07.77d.js => v.wzS.d0ae3f07.77d.js
 * @param {String} file 字典文件
 * @param {Object} key 字典键值
 *
 * @returns {Function} 模块重命名函数:rename, rename.short: 字符串缩写函数
 */
module.exports = function(file, key) {
  const DIC = updateJSON(file, key) || {} // 重用已有字典
  const short = shortString(DIC) // 字符串缩写函数
  process.on('beforeExit', () => updateJSON(file, key, DIC))

  /** 重命名 vender chunks (命名映射:build/~fileName)
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

  rename.short = short // 暴露缩写函数
  return rename
}
