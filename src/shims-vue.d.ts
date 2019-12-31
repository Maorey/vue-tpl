/*
 * @Description: vue 扩展
 * @Author: 毛瑞
 * @Date: 2019-07-09 17:15:16
 */
import Vue, { VNode } from 'vue'

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
    /** 默认绑定<style module> class名字典
     */
    $style: IObject<string>
    /** 是否满足(全部)指定权限
     * @param {...String} authKey 权限id
     *
     * @returns {Boolean}
     */
    authFit: (...authKey: string[]) => boolean
    /** 是否包含指定权限(之一)
     * @param {...String} authKey 权限id
     *
     * @returns {Boolean}
     */
    authAny: (...authKey: string[]) => boolean

    /// element-UI 组件快速方法 ///

    $loading: (options: {
      target?: Element | Node | string
      body?: boolean
      fullscreen?: boolean
      lock?: boolean
      text?: string
      spinner?: string
      background?: string
      customClass?: string
    }) => void
    $msgbox: IMsgbox
    $alert: IMsgbox['alert']
    $confirm: IMsgbox['confirm']
    $prompt: IMsgbox['prompt']
    $notify: INotification
    $message: IMessage
  }
  // interface VueConstructor {
  //   store: any
  //   router: any
  // }
}

// declare module 'vue/types/options' {
//   interface ComponentOptions<V extends Vue> {
//   }
// }
