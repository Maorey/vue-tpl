/** see: https://championswimmer.in/vuex-module-decorators
 * @Description: 图片下载内存管理
 * @Author: 默认
 * @Date: 2020-04-20 11:02:15
 */
import { Module, getModule } from 'vuex-module-decorators'
import RootImage, { ILocal } from '@/store/image'

import { PREFER } from './prefer'
import store from '..'

export * from '@/store/image'

/** 文件下载管理 */
@Module({ dynamic: true, namespaced: true, name: 'image', store })
class Image extends RootImage {
  constructor(module: Image) {
    // 覆盖本地存储信息
    super(module, PREFER.img || (PREFER.img = {} as ILocal))
  }
}

export default getModule(Image)
