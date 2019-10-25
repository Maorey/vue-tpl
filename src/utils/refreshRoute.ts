/*
 * @Description: 局部刷新路由（依赖 ./highOrder getAsync hack）
 * @Author: 毛瑞
 * @Date: 2019-09-17 15:58:46
 */
import Vue from 'vue'
import { RouteRecord } from 'vue-router'

/** 强制更新递归深度
 */
const DEEP_RECURSION = 5
/** 强制更新vue组件及其子组件
 * @param {Vue} vm Vue组件实例
 */
function forceUpdateRecursion(vm: Vue, deep = 0) {
  if (deep++ > DEEP_RECURSION) {
    return
  }
  vm.$forceUpdate() // 更新自身
  for (let child of vm.$children) {
    forceUpdateRecursion(child, deep) // 更新后代
  }
}
/** 强制更新vue异步组件及其子(异步)组件
 * @param {Vue} vm Vue组件实例
 */
function forceEmitRecursion(vm: Vue, deep = 0) {
  if (deep++ > DEEP_RECURSION) {
    return
  }
  vm.$emit('$') // 更新自身
  for (let child of vm.$children) {
    forceEmitRecursion(child, deep) // 更新后代
  }
}
/** 强制更新当前路由
 * @param {RouteRecord[]} matched 当前匹配的路由列表
 */
function refreshRoute(matched: RouteRecord[]) {
  for (let record of matched) {
    for (let key in record.instances) {
      // v-if hack 会丢失所有缓存
      // forceUpdateRecursion(record.instances[key])
      forceEmitRecursion(record.instances[key])
    }
  }
}

export default refreshRoute
