// 皮肤工具
import Vue from 'vue'

// css 对象集合(就不用Set了)
const OBJS: IObject<string>[] = []

/** 获取当前皮肤
 */
function get(): string {
  return (window as any)[process.env.THEME_FIELD] || process.env.THEME
}

/** 设置当前皮肤
 * @param {String} skin 要设置的皮肤名
 */
function set(skin?: string) {
  if ((skin || (skin = process.env.THEME as string)) === get()) {
    return skin
  }

  /// 切换样式 ///
  let el
  for (el of document.querySelectorAll<HTMLLinkElement>('link[title]')) {
    el.disabled = el.title !== skin
  }

  /// 更新css对象 ///
  for (el of OBJS) {
    Object.assign(el, (el.$ as any)[skin])
  }

  return ((window as any)[process.env.THEME_FIELD] = skin)
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
  Object.defineProperty(obj, '$', { get: () => dic })
  OBJS.push(obj)

  return obj
}

export { getObj as default, get, set }
