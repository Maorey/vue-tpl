/*
 * @Description: 图片展示 (图片文件需要授权)
 * @Author: 毛瑞
 * @Date: 2020-03-02 13:25:23
 */
// see: https://github.com/kaorun343/vue-property-decorator
import { Component } from 'vue-property-decorator'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@com/hoc'
// import STYLE from './index.module.scss'
import Image from '@com/Image'
import storeImage from '@index/store/modules/image'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )

// TODO: lazy/大图预览/保存图片

/// 选项 name,directives,filters,extends,mixins ///
@Component
export default class extends Image {
  /// [model] (@Model('change') readonly attr!: string) ///
  /// [props] (@Prop() readonly attr!: string) ///
  /// [data] (attr: string = '响应式属性' // 除了 undefined) ///
  /// 非响应式属性 (attr?: string // undefined) ///
  /// [computed] (get attr() {} set attr(){}) ///
  protected get store() {
    return storeImage
  }

  /// [LifeCycle] (protected beforeCreate(){}/.../destroyed(){}) ///
  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {}) ///
  /// [methods] (method(){}) ///
}
