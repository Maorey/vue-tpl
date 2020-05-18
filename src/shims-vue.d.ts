/* vue 扩展申明 */

import { VNode } from 'vue'
import { on, off, once, emit } from '@/utils/eventBus'

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
  interface Vue {
    /** .vue <style module> class名字典计算属性 */
    $style: IObject<string>
    /** [消息总线]监听事件 */
    on: typeof on
    /** [消息总线]单次监听事件 */
    once: typeof once
    /** [消息总线]取消监听事件
     * 如果同时提供了事件与回调，则只移除这个回调的监听器
     * ？如果只提供了事件，则移除该事件所有的监听器
     * ？如果只提供了监听器，则移除所有该监听器
     * ！如果没有提供参数(eventName === undefined)，则移除所有的事件监听器
     */
    off: typeof off
    /** [消息总线]触发事件
     * @param eventKey string:事件标识 string[]:[事件名, 命名空间]
     */
    emit: typeof emit

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
