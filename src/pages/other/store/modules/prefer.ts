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
import { IParams } from './downloadManager'
import store from '..'

/** 偏好管理 */
export interface IPrefer extends IRootPrefer {
  // 扩展store
  foo: string
}

/** 本地存储单例对象 【应确保本网站(所有html)存储键值不会冲突】 */
export interface IPREFER extends IRootPREFER {
  // 扩展存储键
  other: {
    foo: string
    /** 下载管理相关 */
    download: {
      /** 下载配置 */
      config: {
        /** 同时下载数量(默认3) */
        max: number
        /** 下载队列大小(默认10) */
        queue: number
        /** 自动移除已保存任务时间间隔(ms) */
        alive: number
        /** 自动下载上次未完成任务(默认false) */
        auto?: boolean
      }
      /** 待恢复任务 */
      tasks: IParams[]
    }
  }
}

/** 本地存储的偏好信息对象 单例, 添加请在偏好管理增加定义, 防止key冲突
 */
const RP = ROOT_PREFER as IPREFER
const PREFER = RP.other || (RP.other = { foo: 'foo' } as IPREFER['other'])

@Module({ dynamic: true, namespaced: true, name: 'prefer', store })
class Prefer extends RootPrefer implements IPrefer {
  /// State & Getter(public) ///
  foo = PREFER.foo
  /// Mutation 无法调用/commit 必须通过Action ///
  @Mutation
  private FOO(foo: string) {
    this.foo = foo
  }

  /// Action ///
  /** 设置foo
   * @param {string} foo
   */
  @Action
  setFoo(foo: string) {
    this.FOO(foo) // 动态模块可以不用 context.commit
  }
}

// hook(() => {
//   // 写入本地前处理数据
// })

export default getModule(Prefer)
export { PREFER, hook }
