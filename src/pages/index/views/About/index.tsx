/*
 * @Description: 描述
 * @Author: 作者
 * @Date: 2019-07-09 16:08:07
 */

// import { getAsync } from '@/utils/highOrder' // utils和其他
// import PageHeader from '@indexCom/PageHeader.vue' // 同步组件

import { CreateElement } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'
import $style from './index.module.scss' // CSS Module样式

// const UPPER_CASE:string|number|any[] // 常量
// const camelCase:any // 单例
// function utils() {} // 函数(无副作用)

// 异步组件
// const ModuleOne = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne.vue')
// ) as any

/// name,directives,filters,extends,mixins ///
@Component
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  /// private instance attributes (private name?: string // 非响应式属性) ///
  /// computed (get name() { return this.name } set name()... ///
  /// watch (@Watch) ///
  /// LifeCycle (beforeCreate/created/.../destroyed) ///
  /// methods (private/public) ///
  // see: https://github.com/vuejs/jsx#installation 不加h会解析成argument[0]
  private render(h: CreateElement) {
    return (
      <div class={$style.wrapper}>
        {/* 标题 */}
        {/* <PageHeader /> */}
        {/* 模块一 */}
        {/* <ModuleContainer>
          <template slot='title'>
            <h4>模块一</h4>
          </template>

          <ModuleOne />
        </ModuleContainer> */}
        这里是about页
      </div>
    )
  }
}
