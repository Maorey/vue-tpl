/** see: https://championswimmer.in/vuex-module-decorators
 * @Description: 文件下载管理
 * @Author: 毛瑞
 * @Date: 2020-02-11 14:43:12
 */
import { Module, getModule } from 'vuex-module-decorators'
import RootFile, { ILocal } from '@/store/file'

import { PREFER } from './prefer'
import store from '..'

export * from '@/store/file'

/** 文件下载管理 */
@Module({ dynamic: true, namespaced: true, name: 'file', store })
class File extends RootFile {}

// 覆盖本地存储信息
File.prototype.local = PREFER.file || (PREFER.file = {} as ILocal)

export default getModule(File)
