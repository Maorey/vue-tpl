/** 偏好管理
 */
import { Module, getModule, Mutation, Action } from 'vuex-module-decorators'
import RootPrefer, { IPrefer as RootIPrefer } from '@/store/prefer'
import store from '../'

/** 偏好管理
 */
interface IPrefer extends RootIPrefer {
  foo: string

  // ...
}

@Module({ dynamic: true, namespaced: true, name: 'prefer', store })
class Prefer extends RootPrefer {
  /// State & Getter(public) ///
  foo = ''

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

export default getModule(Prefer)
export { IPrefer }
