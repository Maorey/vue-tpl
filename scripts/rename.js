/*
 * @Description: vender chunks重命名,避免文件名过长,命名映射:build/fileName.map
 * @Author: 毛瑞
 * @Date: 2019-07-25 19:31:14
 */

const updateJSON = require('./updateJSON')

let DIC // 命名缩写记录
// 字符串缩写函数
const short = require('./shortString')(
  {
    // 指定chunk名缩写 eg: index: 'i'
  },
  (name, n) => {
    if (!DIC) {
      DIC = {}
      setTimeout(() => updateJSON('scripts/fileName.map', 'chunkName', DIC))
    }

    DIC[n] = name
  }
)

/** 重命名 vender chunks (命名映射:scripts/fileName.map)
 *    vendors.main.other.user.d0ae3f07.77d.js => v.wzS.d0ae3f07.77d.js
 * @param {WebpackModule} module webpack模块
 */
module.exports = module => {
  let name = 'v.' // 前缀
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
