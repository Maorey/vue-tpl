/*
 * @Description: 图片展示 (图片文件需要授权)
 * @Author: 毛瑞
 * @Date: 2020-03-02 13:25:23
 */
import { CreateElement, VNode } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import Info from './Info'

import { isEqual } from '@/utils'
import { download, free, IFile } from '@/utils/downloader'

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

// TODO: lazy/大图预览/保存图片

/// 选项 name,directives,filters,extends,mixins ///
@Component
export default class extends Vue {
  /// [model] (@Model('change') readonly attr!: string) ///
  /// [props] (@Prop() readonly attr!: string) ///
  /** 文件下载地址 */
  @Prop() readonly src!: string
  /** 查询参数 */
  @Prop() readonly query?: IObject
  @Prop() readonly alt?: string
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
  /// [methods] (method(){}) ///
  @Watch('src', { immediate: true })
  @Watch('query')
  private load(value: any, old: any) {
    const src = this.src
    if (!src) {
      return
    }

    // diff
    if (old && isEqual(value, old)) {
      return
    }

    this.status = status.loading
    download(src, this.query)
      .then(res => {
        this.$_file && free(this.$_file)
        this.$_file = res
        this.status = status.success
      })
      .catch(() => {
        this.status = status.error
      })
  }

  // see: https://github.com/vuejs/jsx#installation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private render(h: CreateElement) {
    if (this.isSleep) {
      return this.$_vnode
    }

    // 依赖收集
    switch (this.status) {
      case status.init:
        return (this.$_vnode = (
          <Info
            icon="el-icon-picture"
            type="info"
            msg={this.alt}
            retry="加载图片"
            on={{ $: this.load }}
          />
        ))
      case status.loading:
        return (this.$_vnode = (
          <Info
            icon="el-icon-picture"
            type="primary"
            msg={this.alt}
            retry="加载中"
          />
        ))
      case status.error:
        return (this.$_vnode = (
          <Info
            icon="el-icon-picture-outline"
            msg={this.alt}
            on={{ $: this.load }}
          />
        ))
      default:
        return (this.$_vnode = (
          <img src={(this.$_file as IFile).src} alt={this.alt} />
        ))
    }
  }
}
