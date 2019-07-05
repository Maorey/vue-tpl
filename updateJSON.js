/*
 * @Description: 修改JSON文件
 * @Author: 毛瑞
 * @Date: 2019-07-03 13:24:19
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-05 14:26:28
 */
const fs = require('fs')
const path = require('path')

const REG_SPLIT = /\.(?!['"])/

module.exports = function(fileName, key, value) {
  fileName = path.resolve(fileName)
  key = key.split(REG_SPLIT)

  // 同步
  let json
  if (!fs.existsSync(fileName)) {
    json = {}
  } else {
    try {
      json = JSON.parse(fs.readFileSync(fileName).toString())
    } catch (error) {
      return
    }
  }

  // 查找修改并写入
  let parent
  let current = json
  let k
  for (k of key) {
    parent = current
    current = parent[k] === undefined ? (parent[k] = {}) : parent[k]
  }

  // 没有修改
  if (
    typeof value === 'object' && typeof current === 'object'
      ? JSON.stringify(current) !== JSON.stringify(value)
      : current !== value
  ) {
    parent[k] = value

    try {
      fs.writeFileSync(fileName, JSON.stringify(json, null, 2))
    } catch (error) {
      console.error(`写入${fileName}失败`, error)
    }
  }
}
