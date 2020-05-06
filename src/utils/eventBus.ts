/*
 * @Description: 全局（单例）消息总线
 * @Author: 毛瑞
 * @Date: 2019-06-03 12:12:12
 */
import { isString, isUndef } from '.'

/** 事件处理函数 */
interface IHandler {
  (...args: any[]): any
  /** 是否只监听一次 */
  _once?: 1
}

const BUS = new Map<string, Set<IHandler>>()

/** 监听事件
 * @test true
 *
 * @param {String} eventName 事件名
 * @param {String|IHandler} nameSpace:String 命名空间 handler:IHandler 事件处理函数
 * @param {IHandler} handler 事件处理函数
 * @param {Boolean} isOnce 是否只监听一次
 */
function on(
  eventName: string,
  nameSpace: string,
  handler: IHandler,
  isOnce?: boolean
): void
function on(eventName: string, handler: IHandler, isOnce?: boolean): void
function on(eventName: any, nameSpace: any, handler?: any, isOnce?: any) {
  if (isString(nameSpace)) {
    eventName = nameSpace + '.' + eventName
  } else {
    isOnce = handler
    handler = nameSpace
  }

  isOnce && (handler._once = 1)
  nameSpace = BUS.get(eventName)
  nameSpace || BUS.set(eventName, (nameSpace = new Set<IHandler>()))
  nameSpace.add(handler)
}

/** 单次监听事件
 * @test true
 *
 * @param {String} eventName 事件名
 * @param {String|IHandler} nameSpace:String 命名空间 handler:IHandler 事件处理函数
 * @param {IHandler} handler 事件处理函数
 */
function once(eventName: string, nameSpace: string, handler: IHandler): void
function once(eventName: string, handler: IHandler): void
function once(eventName: any, nameSpace: any, handler?: any) {
  on(eventName, nameSpace, handler, true)
}

/** 取消监听事件
 * @test true
 *
 * 如果同时提供了事件与回调，则只移除这个回调的监听器
 * ？如果只提供了事件，则移除该事件所有的监听器
 * ？如果只提供了监听器，则移除所有该监听器
 * ！如果没有提供参数(eventName === undefined)，则移除所有的事件监听器
 * @param {String} eventName 事件名
 * @param {String|IHandler} String:nameSpace 命名空间 IHandler:handler 事件处理函数
 * @param {IHandler} handler 事件处理函数
 */
function off(): void
function off(handler: IHandler): void
function off(eventName: string): void
function off(eventName: string, handler: IHandler): void
function off(eventName: string, nameSpace: string): void
function off(eventName: string, nameSpace: string, handler: IHandler): void
function off(eventName?: any, nameSpace?: any, handler?: any) {
  if (isUndef(eventName)) {
    BUS.clear() // [注销全部事件]
  } else if (!isString(eventName)) {
    BUS.forEach((handlers, key) => {
      handlers.delete(eventName)
      handlers.size || BUS.delete(key)
    })
  } else {
    if (isString(nameSpace)) {
      eventName = nameSpace + '.' + eventName
    } else {
      handler = nameSpace
    }

    if ((nameSpace = BUS.get(eventName))) {
      if (handler) {
        nameSpace.delete(handler)
        nameSpace.size || BUS.delete(eventName)
      } else {
        BUS.delete(eventName)
      }
    }
  }
}

/** 触发事件
 * @test true
 *
 * @param {String|String[]} eventKey String:事件标识 [事件名, 命名空间]
 * @param {...Any} args 事件参数列表
 */
function emit(eventKey: string | string[], ...args: any[]) {
  eventKey = isString(eventKey) ? eventKey : eventKey[1] + '.' + eventKey[0]
  const handlers = BUS.get(eventKey)
  handlers &&
    handlers.forEach(handler => {
      handler.apply(null, args)
      if (handler._once) {
        handlers.delete(handler)
        handlers.size || BUS.delete(eventKey as string)
      }
    })
}

export { on, off, once, emit }
