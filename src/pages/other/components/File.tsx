/*
 * @Description: 文件下载(链接)
 *【请确保(所在入口/当前文件)引用了'~element-ui/packages/theme-chalk/src/link'样式】
 * @Author: 毛瑞
 * @Date: 2020-03-02 16:46:53
 */
// see: https://github.com/kaorun343/vue-property-decorator
import { Component } from 'vue-property-decorator'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import File from '@com/File'
import storeFile from '@index/store/modules/file'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )

/// 选项 name,directives,filters,extends,mixins ///
@Component
export default class extends File {
  /// [model] (@Model('change') readonly attr!: string) ///
  /// [props] (@Prop() readonly attr!: string) ///
  /// [data] (attr: string = '响应式属性' // 除了 undefined) ///
  /// 非响应式属性 (attr?: string // undefined) ///
  /// [computed] (get attr() {} set attr(){}) ///
  protected get store() {
    return storeFile
  }
  /// [LifeCycle] (private beforeCreate(){}/.../destroyed(){}) ///
  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {}) ///
  /// [methods] (method(){}) ///
}
