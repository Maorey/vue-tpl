/*
 * @Description: 图片展示 (图片文件需要授权)
 * @Author: 毛瑞
 * @Date: 2020-03-02 13:25:23
 */
import { CreateElement } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from 'vue-property-decorator'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import Info from './Info'

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
  @Prop() readonly url!: string
  /** 查询参数 */
  @Prop() readonly query?: IObject
  /// [data] (attr: string = '响应式属性' // 除了 undefined) ///
  private status: status = status.init
  /// 非响应式属性 (attr?: string // undefined) ///
  private $_file?: IFile
  /// [computed] (get attr() {} set attr(){}) ///
  /// [LifeCycle] (private beforeCreate(){}/.../destroyed(){}) ///
  private created() {
    this.load()
  }

  private beforeDestroy() {
    this.$_file && free(this.$_file)
  }

  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {}) ///
  /// [methods] (method(){}) ///
  private load() {
    this.status = status.loading
    download(this.url, this.query)
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
    // 依赖收集
    switch (this.status) {
      case status.init:
        return (
          <Info
            icon="el-icon-picture"
            type="info"
            msg=""
            retry="加载图片"
            on={{ $: this.load }}
          />
        )
      case status.loading:
        return (
          <Info icon="el-icon-picture" type="primary" msg="加载中" retry="" />
        )
      case status.error:
        return <Info icon="el-icon-picture-outline" on={{ $: this.load }} />
      default:
        return <img src={(this.$_file as IFile).src} />
    }
  }
}
