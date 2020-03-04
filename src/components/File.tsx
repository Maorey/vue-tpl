/*
 * @Description: 文件下载(链接)
 * @Author: 毛瑞
 * @Date: 2020-03-02 16:46:53
 */
import { CreateElement } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import ElLink from 'element-ui/lib/link'

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
  @Prop() readonly url!: string
  /** 显示文字 */
  @Prop() readonly text!: string
  /** 查询参数 */
  @Prop() readonly query?: IObject
  /** 查询参数 */
  @Prop({ default: 'primary' }) readonly type?: string
  /// [data] (attr: string = '响应式属性' // 除了 undefined) ///
  private status: status = status.init
  /// 非响应式属性 (attr?: string // undefined) ///
  private $_file?: IFile
  /// [computed] (get attr() {} set attr(){}) ///
  /// [LifeCycle] (private beforeCreate(){}/.../destroyed(){}) ///
  private beforeDestroy() {
    this.$_file && free(this.$_file)
  }

  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {}) ///
  /// [methods] (method(){}) ///
  @Watch('url')
  @Watch('query')
  private load() {
    this.status = status.loading
    download(this.url, this.query)
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

  private save() {
    save(this.$_file as IFile)
  }

  private reset() {
    this.status = status.init
    this.$_file && free(this.$_file)
  }

  // see: https://github.com/vuejs/jsx#installation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private render(h: CreateElement) {
    // 依赖收集
    switch (this.status) {
      case status.loading:
        return (
          <ElLink disabled type={this.type} icon="el-icon-loading">
            {this.text}
          </ElLink>
        )
      case status.error:
        return (
          <ElLink
            type="danger"
            icon="el-icon-refresh-right"
            on={{ click: this.load }}
          >
            {this.text}
          </ElLink>
        )
      default:
        return (
          <ElLink
            type={this.type}
            icon="el-icon-document"
            on={{ click: this.status === status.init ? this.load : this.save }}
          >
            {this.text}
          </ElLink>
        )
    }
  }
}
