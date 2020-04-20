/*
 * @Description: 偏好管理
 * @Author: 毛瑞
 * @Date: 2019-06-19 15:16:19
 */
import { Module, Mutation, getModule } from 'vuex-module-decorators'
import RootPrefer, {
  IPrefer as IRootPrefer,
  IPREFER as IRootPREFER,
  PREFER as ROOT_PREFER,
  hook,
} from '@/store/prefer'
import { ILocal as IFile } from './file'
import { ILocal as IImage } from './image'
import store from '..'

/** 偏好管理 */
export interface IPrefer extends IRootPrefer {
  // 扩展store
  foo: string
}

/** 【全部偏好设置】 【应确保本网站(所有html)存储键值不会冲突】 */
export interface IPREFER extends IRootPREFER {
  // 扩展存储键
  other: {
    foo: string
    /** 文件下载管理相关 */
    file: IFile
    /** 图片下载管理相关 */
    img: IImage
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
  /// Mutation ///
  @Mutation
  SET_FOO(foo: string) {
    this.foo = foo
  }

  /// Action ///
}

// hook(() => {
//   // 写入本地前处理数据
// })

export default getModule(Prefer)
export { PREFER, hook }
