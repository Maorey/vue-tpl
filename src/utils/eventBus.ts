/*
 * @Description: 全局（单例）消息总线
 * @Author: 毛瑞
 * @Date: 2019-06-03 12:12:12
 */
import Vue from 'vue'

const BUS = new Vue()

/** 事件处理函数
 */
type Handler = (...args: any[]) => any

/** 监听事件
 * @test true
 *
 * @param {String} eventName 事件名
 * @param {String|Handler} nameSpace:String 命名空间 handler:Handler 事件处理函数
 * @param {Handler} handler 事件处理函数
 * @param {Boolean} isOnce 是否只监听一次
 */
function on(
  eventName: string,
  nameSpace: string | Handler,
  handler?: Handler,
  isOnce?: boolean
) {
  // 参数处理
  if (typeof nameSpace === 'string') {
    eventName = nameSpace + '.' + eventName
  } else {
    handler = nameSpace
  }

  handler && BUS[isOnce ? '$once' : '$on'](eventName, handler) // 注册事件
}

/** 单次监听事件
 * @test true
 *
 * @param {String} eventName 事件名
 * @param {String|Handler} nameSpace:String 命名空间 handler:Handler 事件处理函数
 * @param {Handler} handler 事件处理函数
 */
function once(
  eventName: string,
  nameSpace: string | Handler,
  handler?: Handler
) {
  on(eventName, nameSpace, handler, true)
}

/** 取消监听事件
 * @test true
 *
 * 如果没有提供事件，则移除所有的事件监听器
 * 如果只提供了事件，则移除该事件所有的监听器
 * 如果同时提供了事件与回调，则只移除这个回调的监听器
 * @param {String} eventName 事件名
 * @param {String|Handler} String:nameSpace 命名空间 Handler:handler 事件处理函数
 * @param {Handler} handler 事件处理函数
 */
function off(
  eventName?: string,
  nameSpace?: string | Handler,
  handler?: Handler
) {
  if (eventName === undefined) {
    BUS.$off() // 注销全部事件
  } else {
    // 参数处理
    if (typeof nameSpace === 'string') {
      eventName = nameSpace + '.' + eventName
    } else if (nameSpace) {
      handler = nameSpace
    }

    BUS.$off(eventName, handler) // 注销事件
  }
}

/** 触发事件
 * @test true
 *
 * @param {String} eventKey 事件 (= 命名空间.事件名)
 * @param {...Any} args 事件参数列表
 */
function emit(eventKey: string, ...args: any[]) {
  BUS.$emit(eventKey, ...args)
}

export { on, off, once, emit }
