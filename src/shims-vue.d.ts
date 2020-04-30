/* vue 扩展申明 */

import { VNode } from 'vue'
import { Handler } from '@/utils/eventBus'

type type = 'success' | 'warning' | 'info' | 'error'
type action = 'confirm' | 'cancel' | 'close'
interface IMsgboxOptions {
  type: type
  title?: string
  message?: string | VNode
  dangerouslyUseHTMLString?: string
  iconClass?: string
  customClass?: string
  callback?: (action: action, instance: any) => void
  showClose?: boolean
  beforeClose?: (action: action, instance: any, done: () => void) => void
  distinguishCancelAndClose?: boolean
  lockScroll?: boolean
  showCancelButton?: boolean
  showConfirmButton?: boolean
  cancelButtonText?: string
  confirmButtonText?: string
  cancelButtonClass?: string
  confirmButtonClass?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  closeOnHashChange?: boolean
  showInput?: boolean
  inputPlaceholder?: string
  inputType?: string
  inputValue?: string
  inputPattern?: RegExp
  inputValidator?: (value: string) => boolean | string
  inputErrorMessage?: string
  center?: boolean
  roundButton?: boolean
}
interface IFullMsgboxOptions extends IMsgboxOptions {
  title: string
  message: string | VNode
}
type Msgbox = (options: IFullMsgboxOptions) => Promise<any>
type MsgboxShortMethod = (
  message: string | VNode,
  title: string | IMsgboxOptions,
  options?: IMsgboxOptions
) => Promise<any>
interface IMsgbox extends Msgbox {
  alert: MsgboxShortMethod
  confirm: MsgboxShortMethod
  prompt: MsgboxShortMethod
  close: () => void
}

interface INotificationOptions {
  title?: string
  message: string | VNode
  dangerouslyUseHTMLString?: string
  iconClass?: string
  customClass?: string
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  showClose?: boolean
  onClose?: () => void
  onClick?: () => void
  offset?: number
}
interface IFullNotificationOptions extends INotificationOptions {
  type: type
}
type Notification = (options: IFullNotificationOptions) => void
type NotificationShortMethod = (message: string | INotificationOptions) => void
interface INotification extends Notification {
  success: NotificationShortMethod
  warning: NotificationShortMethod
  info: NotificationShortMethod
  error: NotificationShortMethod
  close: () => void
  closeAll: () => void
}

interface IMessageOptions {
  message: string | VNode
  center?: boolean
  showClose?: boolean
  distinguishCancelAndClose?: boolean
  iconClass?: string
  customClass?: string
  offset?: number
  duration?: number
  onClose?: (instance: any) => void
}
interface IFullMessageOptions extends IMessageOptions {
  type: type
}
type Message = (options: IFullMessageOptions) => void
type MessageShortMethod = (message: string | IMessageOptions) => void
interface IMessage extends Message {
  success: MessageShortMethod
  warning: MessageShortMethod
  info: MessageShortMethod
  error: MessageShortMethod
  close: () => void
  closeAll: () => void
}

declare module 'vue/types/vue' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Vue {
    /** .vue <style module> class名字典计算属性 */
    $style: IObject<string>
    // /** 是否满足(全部)指定权限
    //  * @param {...String} authKey 权限id
    //  *
    //  * @returns {Boolean}
    //  */
    // authFit: (...authKey: string[]) => boolean
    // /** 是否包含指定权限(之一)
    //  * @param {...String} authKey 权限id
    //  *
    //  * @returns {Boolean}
    //  */
    // authAny: (...authKey: string[]) => boolean
    /** [eventBus]监听事件
     * @param {String} eventName 事件名
     * @param {String|Handler} nameSpace:String 命名空间 handler:Handler 事件处理函数
     * @param {Handler} handler 事件处理函数
     * @param {Boolean} isOnce 是否只监听一次
     */
    on: (
      eventName: string,
      nameSpace: string | Handler,
      handler?: Handler,
      isOnce?: boolean
    ) => void
    /** [eventBus]单次监听事件
     * @param {String} eventName 事件名
     * @param {String|Handler} nameSpace:String 命名空间 handler:Handler 事件处理函数
     * @param {Handler} handler 事件处理函数
     */
    once: (
      eventName: string,
      nameSpace: string | Handler,
      handler?: Handler
    ) => void
    /** [eventBus]取消监听事件
     * 如果同时提供了事件与回调，则只移除这个回调的监听器
     * ？如果只提供了事件，则移除该事件所有的监听器 (文档有写并未实现)
     * ！如果没有提供参数(eventName === undefined)，则移除所有的事件监听器
     * @param {String} eventName 事件名
     * @param {String|Handler} String:nameSpace 命名空间 Handler:handler 事件处理函数
     * @param {Handler} handler 事件处理函数
     */
    off: (
      eventName?: string,
      nameSpace?: string | Handler,
      handler?: Handler
    ) => void
    /** [eventBus]触发事件
     * @param {String} eventKey 事件标识 (= 命名空间.事件名)
     * @param {...Any} args 事件参数列表
     */
    emit: (eventKey: string, ...args: any[]) => void

    /// element-UI 组件快速方法 ///
    /** 加载 */
    $loading: (options: {
      target?: Element | Node | string
      body?: boolean
      fullscreen?: boolean
      lock?: boolean
      text?: string
      spinner?: string
      background?: string
      customClass?: string
    }) => { close: () => void }
    /** 弹框消息 */
    $msgbox: IMsgbox
    /** 弹框提示消息 */
    $alert: IMsgbox['alert']
    /** 弹框确认消息 */
    $confirm: IMsgbox['confirm']
    /** 弹框提示确认 */
    $prompt: IMsgbox['prompt']
    /** 通知消息 */
    $notify: INotification
    /** 提示消息 */
    $message: IMessage
  }
  // interface VueConstructor { }
}

// declare module 'vue/types/options' {
//   interface ComponentOptions<V extends Vue> { }
// }
