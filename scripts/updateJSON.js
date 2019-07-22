/*
 * @Description: 修改JSON文件
 * @Author: 毛瑞
 * @Date: 2019-07-03 13:24:19
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-22 09:46:47
 */
const fs = require('fs')
const path = require('path')

const REG_SPLIT = /\.(?!['"])/

module.exports = function(fileName, key, value) {
  fileName = path.resolve(fileName)
  key = key.split(REG_SPLIT)

  let json
  if (!fs.existsSync(fileName)) {
    json = {}
  } else {
    // 同步读
    try {
      json = JSON.parse(fs.readFileSync(fileName).toString())
    } catch (error) {
      return
    }
  }

  // 查找修改
  let parent
  let current = json
  let k
  for (k of key) {
    parent = current
    current = parent[k] === undefined ? (parent[k] = {}) : parent[k]
  }

  if (
    typeof value === 'object' && typeof current === 'object'
      ? JSON.stringify(current) !== JSON.stringify(value)
      : current !== value
  ) {
    parent[k] = value
    // 异步写
    fs.writeFile(
      fileName,
      JSON.stringify(json, null, 2),
      error => error && console.error(`写入${fileName}失败`, error)
    )
  }
}
