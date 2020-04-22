/*
 * @Description: Websocket 封装
 *   视具体情况对接, 比如自定义事件(onmessage), 以实现多个事务复用一个链接(需服务端配合)
 * @Author: 毛瑞
 * @Date: 2020-04-20
 */
import { isEqual } from '@/utils'
interface IOptions {
  /** 子协议 */
  protocols?: string | string[]
  /** 字节流传输方式 */
  binaryType?: BinaryType
  onclose?: WebSocket['onclose']
  onerror?: WebSocket['onerror']
  onmessage?: WebSocket['onmessage']
  onopen?: WebSocket['onopen']
  /** 连接超时时间 */
  timeout?: number
  /** 重连最小时间间隔[默认1000] */
  interval?: number
  /** 重连尝试次数, 设置为0则不自动重连 */
  retry?: number
  // 打日志就算了
}
interface IDefaultOptions extends IOptions {
  protocols?: string[]
}
interface IWebsocket {
  /** 监听事件 */
  on: WebSocket['addEventListener']
  /** 触发事件 */
  emit: WebSocket['dispatchEvent']
  /** 取消监听 */
  off: WebSocket['removeEventListener']
}

const DEFAULT_OPTIONS: IDefaultOptions = {}
const WS = ((window as any).MozWebSocket as undefined) || window.WebSocket
const DELTA_RETRY = 2 << 10

/** WebSocket 包装 */
export default class {
  /** 默认选项 */
  static defaults = DEFAULT_OPTIONS
  /** 当前选项 */
  options: IOptions
  /** 是否正在重连 */
  isReconnect!: boolean

  /**
   * Returns a string that indicates how binary data from the
   *  WebSocket object is exposed to scripts:
   *
   * Can be set, to change how binary data is returned. The default is "blob".
   */
  get binaryType() {
    return this.ws.binaryType
  }

  set binaryType(binaryType) {
    this.ws.binaryType = binaryType
  }

  /**
   * Returns the number of bytes of application data (UTF-8 text and binary data)
   *  that have been queued using send() but not yet been transmitted to the network.
   *
   * If the WebSocket connection is closed, this attribute's value will only
   *  increase with each call to the send() method. (The number does not
   *  reset to zero once the connection closes.)
   */
  get bufferedAmount() {
    return this.ws.bufferedAmount
  }

  /**
   * Returns the extensions selected by the server, if any.
   */
  get extensions() {
    return this.ws.extensions
  }

  /**
   * Returns the subprotocol selected by the server, if any. It can be used in
   *  conjunction with the array form of the constructor's second argument to
   *  perform subprotocol negotiation.
   */
  get protocol() {
    return this.ws.protocol
  }

  /**
   * Returns the state of the WebSocket object's connection.
   *  It can have the values described below.
   */
  get readyState() {
    return this.isReconnect ? WS.CONNECTING : this.ws.readyState
  }

  /**
   * Returns the URL that was used to establish the WebSocket connection.
   */
  get url() {
    return this.ws.url
  }

  get CLOSED() {
    return this.ws.CLOSED
  }

  get CLOSING() {
    return this.ws.CLOSING
  }

  get CONNECTING() {
    return this.ws.CONNECTING
  }

  get OPEN() {
    return this.ws.OPEN
  }

  private ws!: WebSocket
  private attempt = 0
  private forceClose?: boolean
  private ons: any[] = []

  /** 构造函数
   * @param url
   * @param options
   */
  constructor(url: string, options?: IOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options }

    options &&
      options.protocols &&
      DEFAULT_OPTIONS.protocols &&
      (this.options.protocols = DEFAULT_OPTIONS.protocols.concat(
        options.protocols
      ))

    this.connect(url)
  }

  /** 连接/重连接
   */
  connect(url?: string) {
    this.isReconnect = false
    const options = this.options
    if (url) {
      this.attempt = 0
    } else if (this.attempt > (options.retry as number)) {
      return
    }

    if (this.ws) {
      this.ws.close()
      return this
    }

    const ws = (this.ws = new WS(url || this.url, options.protocols))
    options.binaryType && (ws.binaryType = options.binaryType)

    let timeout: number
    options.timeout && (timeout = setTimeout(ws.close, options.timeout))

    ws.onopen = event => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = 0
      }
      this.attempt = 0

      options.onopen && options.onopen.call(ws, event)
    }
    ws.onclose = event => {
      timeout && clearTimeout(timeout)
      if (this.forceClose) {
        this.forceClose = false
        options.onclose && options.onclose.call(ws, event)
      } else {
        this.isReconnect = true
        const interval = options.interval || 0
        setTimeout(() => {
          this.attempt++
          this.connect(url)
        }, Math.random() * DELTA_RETRY * this.attempt + interval)
        this.emit(new Event('connecting'))
      }
    }
    ws.onmessage = event => {
      options.onmessage && options.onmessage.call(ws, event)
    }
    ws.onerror = event => {
      options.onerror && options.onerror.call(ws, event)
    }
    ;(this as any).on()

    return this
  }

  /** 监听事件
   * Appends an event listener for events whose type attribute value is type.
   *  The callback argument sets the callback that will be invoked when
   *  the event is dispatched.
   *
   * The options argument sets listener-specific options. For compatibility
   *  this can be a boolean, in which case the method behaves exactly as if
   *  the value was specified as options's capture.
   *
   * When set to true, options's capture prevents callback from being invoked when
   *  the event's eventPhase attribute value is BUBBLING_PHASE. When false (or
   *  not present), callback will not be invoked when
   *  event's eventPhase attribute value is CAPTURING_PHASE. Either way,
   *  callback will be invoked if event's eventPhase attribute value is AT_TARGET.
   *
   * When set to true, options's passive indicates that the callback will
   *  not cancel the event by invoking preventDefault(). This is used to
   *  enable performance optimizations described in § 2.8 Observing event listeners.
   *
   * When set to true, options's once indicates that the callback will
   *  only be invoked once after which the event listener will be removed.
   *
   * The event listener is appended to target's event listener list and
   *  is not appended if it has the same type, callback, and capture.
   */
  on<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void

  on(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void

  on(...args: any[]) {
    const ons = this.ons
    let params
    if (args.length) {
      for (params of ons) {
        if (isEqual(params, args)) {
          return
        }
      }
      ons.push(args)
    } else {
      const ws = this.ws
      for (params of ons) {
        ws.addEventListener.apply(ws, params)
      }
    }
  }

  /** 触发事件
   * Dispatches a synthetic event event to target and returns true
   *  if either event's cancelable attribute value is
   * false or its preventDefault() method was not invoked, and false otherwise.
   */
  emit(event: Event) {
    return this.ws.dispatchEvent(event)
  }

  /** 取消监听
   * Removes the event listener in target's event listener list with
   * the same type, callback, and options.
   */
  off<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void

  off(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void

  off(...args: any[]) {
    if (args.length) {
      for (let i = 0, ons = this.ons, len = ons.length; i < len; i++) {
        if (isEqual(ons[i], args)) {
          ons.splice(i, 1)
          this.ws.removeEventListener.apply(this.ws, args as any)
          return
        }
      }
    }
  }

  /**
   * Closes the WebSocket connection, optionally using
   *  code as the WebSocket connection close code and
   *  reason as the WebSocket connection close reason.
   */
  close(code?: number, reason?: string) {
    this.forceClose = true
    this.ws.close(code, reason)
  }

  /**
   * Transmits data using the WebSocket connection. data can be
   *  a string, a Blob, an ArrayBuffer, or an ArrayBufferView.
   */
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    this.ws.send(data)
  }
}
