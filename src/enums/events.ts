/** eventBus 事件 */

/** 全局事件 [参数:描述, ...] */
export const enum GLOBAL {
  // skinchanged = process.env.SKIN_FIELD,
  /** 刷新页面 */
  refresh = 'a',
  /** 返回上级页面 [refresh:是否刷新] */
  return = 'b',
  /** 跳转 [id:模块id, path:拼接好的路径] */
  jump = 'c',
  /** <body>点击事件 [event:MouseEvent] */
  click = 'd',
}
