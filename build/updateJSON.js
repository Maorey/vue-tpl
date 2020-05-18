/*
 * @Description: 读取/更新JSON文件
 * @Author: 毛瑞
 * @Date: 2019-07-03 13:24:19
 */
const fs = require('fs')
const path = require('path')

const REG_SPLIT = /\.(?!['"])/
function isEqual(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y // isEqual(0, -0) => false
  }

  // eslint-disable-next-line no-self-compare
  if (x !== x && y !== y) {
    return true // isEqual(NaN, NaN) => true
  }

  let temp // 工具人
  if (Array.isArray(x)) {
    if (!Array.isArray(y) || (temp = x.length) !== y.length) {
      return false
    }

    while (temp--) {
      if (!isEqual(x[temp], y[temp])) {
        return false
      }
    }

    return true
  }

  if (typeof x === 'object') {
    if (typeof y !== 'object') {
      return false // 先比较Object.keys()长度不太划算
    }

    const KEYS = {}
    for (temp in x) {
      if (!isEqual(x[temp], y[temp])) {
        return false
      }
      KEYS[temp] = 1
    }

    for (temp in y) {
      if (!KEYS[temp]) {
        return false
      }
    }

    return true
  }

  return false
}

/** 读取/更新json文件
 * @param {string} fileName 文件名(含路径)
 * @param {string} key 目标对象属性, 支持多级, 比如: 'a.b.c'
 * @param {any} value 要更新的值, 不传则返回目标值
 */
module.exports = function(fileName, key, value) {
  fileName = path.resolve(fileName)
  key = key.split(REG_SPLIT)

  let json
  if (!fs.existsSync(fileName)) {
    json = {}
  } else {
    // 同步读
    try {
      json = fs.readFileSync(fileName).toString()
      json = JSON.parse(json)
    } catch (error) {
      return json
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

  if (arguments.length < 3) {
    return current
  }

  if (!isEqual(current, value)) {
    parent[k] = value
    // 异步写
    fs.writeFile(
      fileName,
      JSON.stringify(json, null, 2),
      (error) => error && console.error(`写入${fileName}失败`, error)
    )
  }
}
