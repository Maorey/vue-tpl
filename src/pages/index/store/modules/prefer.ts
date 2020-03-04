/*
 * @Description: 偏好管理
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:16:19
 */
import { Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import RootPrefer, {
  IPrefer as IRootPrefer,
  IPREFER as IRootPREFER,
  PREFER as ROOT_PREFER,
  hook,
} from '@/store/prefer'
import store from '..'

/** 偏好管理 */
export interface IPrefer extends IRootPrefer {
  // 扩展store
  bar: string
}

/** 本地存储单例对象 【应确保本网站(所有html)存储键值不会冲突】 */
export interface IPREFER extends IRootPREFER {
  // 扩展存储键
  other: {
    bar: string
  }
}

/** 本地存储的偏好信息对象 单例, 添加请在偏好管理增加定义, 防止key冲突
 */
const RP = ROOT_PREFER as IPREFER
const PREFER = RP.other || (RP.other = { bar: 'bar' })

@Module({ dynamic: true, namespaced: true, name: 'prefer', store })
class Prefer extends RootPrefer implements IPrefer {
  /// State & Getter(public) ///
  bar = PREFER.bar
  /// Mutation 无法调用/commit 必须通过Action ///
  @Mutation
  private BAR(bar: string) {
    this.bar = bar
  }

  /// Action ///
  /** 设置bar
   * @param {string} bar
   */
  @Action
  setBar(bar: string) {
    this.BAR(bar) // 动态模块可以不用 context.commit
  }
}

// hook(() => {
//   // 写入本地前处理数据
// })

export default getModule(Prefer)
export { PREFER, hook }
