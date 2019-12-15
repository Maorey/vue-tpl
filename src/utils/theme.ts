/** 皮肤工具(getter & setter 发布订阅/依赖注入就不用了)
 */
import Vue from 'vue'

// css 对象集合(就不用WeekMap/Set了)
const OBJS: IObject<string>[] = []

/** 获取当前皮肤
 *
 * @returns {String} 当前皮肤
 */
function get(): string {
  return (window as any)[process.env.THEME_FIELD] || process.env.THEME
}

/** 设置当前皮肤
 * @param {String} theme 要设置的皮肤名
 *
 * @returns {String} 当前皮肤
 */
function set(theme?: string) {
  if ((theme || (theme = process.env.THEME as string)) === get()) {
    return theme
  }

  /// 切换样式 ///
  let el
  for (el of document.querySelectorAll<HTMLLinkElement>('link[title]')) {
    el.disabled = true // 必须先disabled下
    el.disabled = el.title !== theme
  }

  /// 更新css对象 ///
  for (el of OBJS) {
    Object.assign(el, (el.$ as any)[theme])
  }

  return ((window as any)[process.env.THEME_FIELD] = theme)
}

/** 获取响应式CSS对象(根据皮肤改变)
 * @param {IObject<IObject<string>>} dic 字典，比如: {dark:{wrapper:'asd2'}}
 *
 * @returns {IObject<string>} 响应式CSS Module对象
 */
function getObj(dic: IObject<IObject<string>>) {
  /// 已有 ///
  let obj
  for (obj of OBJS) {
    if ((obj as any).$ === dic) {
      return obj
    }
  }

  /// 新增 ///
  obj = Vue.observable({ ...dic[get()] })
  Object.defineProperty(obj, '$', { value: dic })
  OBJS.push(obj)

  return obj
}

/** 删除一个响应式CSS对象(的引用，释放内存)
 * @param {IObject<string>} obj  响应式CSS对象
 */
function delObj(obj: IObject<string>) {
  for (let i = 0, len = OBJS.length; i < len; i++) {
    if (obj === OBJS[i]) {
      OBJS.splice(i, 1)
      return
    }
  }
}

export { getObj as default, delObj, get, set }
