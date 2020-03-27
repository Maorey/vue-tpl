/*
 * @Description: 文件下载(链接)
 *【请确保(所在入口/当前文件)引用了'~element-ui/packages/theme-chalk/src/link'样式】
 * @Author: 毛瑞
 * @Date: 2020-03-02 16:46:53
 */
import { CreateElement, VNode } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import ElLink from 'element-ui/lib/link'

import { isEqual } from '@/utils'
import { download, free, IFile, save } from '@/utils/downloader'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )
const enum status {
  init = 0,
  loading = 1,
  error = 2,
  success = 3,
}
const ALIVE = 30 * 1000 // 下载的文件缓存 30s

/// 选项 name,directives,filters,extends,mixins ///
@Component
export default class extends Vue {
  /// [model] (@Model('change') readonly attr!: string) ///
  /// [props] (@Prop() readonly attr!: string) ///
  /** 文件下载地址 */
  @Prop() readonly href!: string
  /** 查询参数 */
  @Prop() readonly query?: IObject
  /** 显示文字 */
  @Prop() readonly text?: string
  /** 禁用 */
  @Prop() readonly disabled?: boolean
  /** 类型 */
  @Prop({ default: 'primary' }) readonly type?: string
  /** 图表 */
  @Prop({ default: 'el-icon-document' }) readonly icon?: string
  /// [data] (attr: string = '响应式属性' // 除了 undefined) ///
  private status: status = status.init
  private isSleep = false // 是否失活/休眠
  /// 非响应式属性 (attr?: string // undefined) ///
  private $_file?: IFile
  private $_vnode?: VNode
  /// [computed] (get attr() {} set attr(){}) ///
  /// [LifeCycle] (private beforeCreate(){}/.../destroyed(){}) ///
  private activated() {
    this.isSleep = false
  }

  private deactivated() {
    this.isSleep = true
  }

  private beforeDestroy() {
    this.$_file && free(this.$_file)
  }

  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {}) ///
  @Watch('href')
  @Watch('query')
  private reset(value: any, old: any) {
    // diff
    if (old && isEqual(value, old)) {
      return
    }

    this.status = status.init
    this.$_file && free(this.$_file)
  }

  /// [methods] (method(){}) ///
  private load() {
    const href = this.href
    if (href) {
      this.status = status.loading
      download(href, this.query)
        .then(res => {
          this.$_file && free(this.$_file)
          this.$_file = res
          this.status = status.success
          this.save()
          setTimeout(this.reset.bind(this), ALIVE)
        })
        .catch(() => {
          this.status = status.error
        })
    }
  }

  private save() {
    save(this.$_file as IFile)
  }

  // see: https://github.com/vuejs/jsx#installation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private render(h: CreateElement) {
    if (this.isSleep) {
      return this.$_vnode
    }

    // 依赖收集
    switch (this.status) {
      case status.loading:
        return (this.$_vnode = (
          <ElLink disabled type={this.type} icon="el-icon-loading">
            {this.text}
            {this.$slots.default}
          </ElLink>
        ))
      case status.error:
        return (this.$_vnode = (
          <ElLink
            type="danger"
            icon="el-icon-refresh-right"
            on={{ click: this.load }}
          >
            {this.text}
            {this.$slots.default}
          </ElLink>
        ))
      default:
        return (this.$_vnode = (
          <ElLink
            type={this.type}
            icon={this.icon}
            disabled={this.disabled}
            on={{ click: this.status === status.init ? this.load : this.save }}
          >
            {this.text}
            {this.$slots.default}
          </ElLink>
        ))
    }
  }
}
