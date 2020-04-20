// 动态模块
import {
  VuexModule,
  Module,
  getModule,
  Mutation,
} from 'vuex-module-decorators'
import store from '../'

/** 动态模块
 */
export interface IDynamic {
  /** 是否动态
   */
  dynamic: boolean

  // ...
}

/** 动态模块
 */
@Module({ dynamic: true, namespaced: true, name: 'dynamic', store })
class Dynamic extends VuexModule implements IDynamic {
  /// State & Getter(public) ///
  dynamic = true

  /// Mutation ///
  @Mutation
  SET_DYNAMIC(dynamic: boolean) {
    this.dynamic = dynamic
  }

  /// Action ///
  /** 设置动态
   * @param {Boolean} dynamic 是否动态
   */
  // @Action
  // setDynamic(dynamic: boolean) {
  //   this.DYNAMIC(dynamic) // 动态模块可以不用 context.commit
  // }
}

export default getModule(Dynamic)
