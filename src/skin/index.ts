/** 皮肤工具(getter & setter 发布订阅/依赖注入就不用了)
 */
import Vue from 'vue'
import { on, emit } from '@/utils/eventBus'

/** 获取当前皮肤
 *
 * @returns {String} 当前皮肤
 */
function get(): string {
  return (window as any)[process.env.SKIN_FIELD] || process.env.SKIN
}

/** 设置当前皮肤(触发eventBus事件process.env.SKIN_FIELD)
 * @param {String} skin 要设置的皮肤名
 *
 * @returns {String} 当前皮肤
 */
function set(skin?: string) {
  if ((skin || (skin = process.env.SKIN as string)) === get()) {
    return skin
  }

  /// 切换样式 ///
  for (const el of document.querySelectorAll<HTMLLinkElement>('link[title]')) {
    el.disabled = true // 必须先disabled下
    el.disabled = el.title !== skin
  }

  /// 触发事件 ///
  emit(process.env.SKIN_FIELD, ((window as any)[process.env.SKIN_FIELD] = skin))

  return skin
}

/** css 对象集合 */
const OBJS: IObject<string>[] = []

/** 获取响应式CSS对象(根据皮肤改变)
 * @param {IObject<IObject<string>>} dic 字典，比如: {dark:{wrapper:'asd2'}}
 *
 * @returns {IObject<string>} 响应式CSS Module对象
 */
function getObj(dic: IObject<IObject<string>>) {
  let obj = dic[get()]

  let key
  let flag = true
  /// 空对象 ///
  for (key in obj) {
    flag = false
    break
  }
  if (flag) {
    return obj
  }

  let item
  /// 值一样 ///
  for (key in dic) {
    if (obj !== (item = dic[key])) {
      for (key in obj) {
        if (obj[key] !== item[key]) {
          flag = true
          break
        }
      }
      if (flag) {
        break
      }
    }
  }
  if (!flag) {
    return obj
  }

  /// 已有 ///
  let itemDic
  for (item of OBJS) {
    if (dic === (itemDic = (item as any).$)) {
      return item
    }

    flag = true
    for (key in dic) {
      // import obj from ‘*.scss’ 得到单例
      if (dic[key] !== itemDic[key]) {
        flag = false
        break
      }
    }
    if (flag) {
      return item
    }
  }

  /// 新增 ///
  obj = Vue.observable({ ...obj })
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

/// 更新css对象 ///
on(process.env.SKIN_FIELD, skin => {
  let obj
  for (obj of OBJS) {
    Object.assign(obj, (obj.$ as any)[skin])
  }
})

export { getObj as default, delObj, get, set }
