/** eventBus 事件 */

/** 全局事件 [参数:描述, ...] */
export const enum GLOBAL {
  // skinchanged = process.env.SKIN_FIELD,
  /** 跳转页面
   * [
   *  location 跳转地址信息 支持相对路径,
   *  options 选项
   *    {
   *      id?: string 目标菜单模块唯一标识
   *      refresh?: boolean 是否刷新
   *      replace?: boolean 使用 router.replace 默认:router.push
   *      onComplete?: 同 router.replace/router.push
   *      onAbort?: 同 router.replace/router.push
   *    }
   * ]
   */
  jump = 'a',
  /** 返回父级页面 (fallback:back|首页) [refresh:是否刷新父级页面] */
  return = 'b',
  /** 刷新当前页 */
  refresh = 'c',
  /** 销毁指定id的页面(下次访问时不会有缓存) */
  purge = 'd',
  /** window点击事件 [event:MouseEvent] */
  click = 'e',
}
