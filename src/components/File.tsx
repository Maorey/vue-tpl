/*
 * @Description: 文件下载(链接)
 *【请确保(所在入口/当前文件)引用了'~element-ui/packages/theme-chalk/src/link'样式】
 * @Author: 毛瑞
 * @Date: 2020-03-02 16:46:53
 */
import { CreateElement, VNode } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from 'vue-property-decorator'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import ElLink from 'element-ui/lib/link'
import storeFile, { STATE, ITask } from '@/store/file'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )

/// 选项 name,directives,filters,extends,mixins ///
@Component
export default class extends Vue {
  /// [model] (@Model('change') readonly attr!: string) ///
  /// [props] (@Prop() readonly attr!: string) ///
  /** 文件下载地址 */
  @Prop() readonly href!: string
  /** 查询参数 */
  @Prop() readonly query?: IObject
  /** 文件名 */
  @Prop() readonly fileName?: string
  /** 显示文字(文件名, 与默认slot二选一) */
  @Prop() readonly text?: string
  /** 是否禁用 */
  @Prop() readonly disabled?: boolean
  /** 图标(TODO: 默认取文件名后缀) */
  @Prop({ default: 'el-icon-document' }) readonly icon!: string
  /// [data] (attr: string = '响应式属性' // 除了 undefined) ///
  private isSleep = false // 是否失活/休眠
  private isDel = 0
  /// 非响应式属性 (attr?: string // undefined) ///
  private $_vnode?: VNode
  /// [computed] (get attr() {} set attr(){}) ///
  /** 【必须重写】文件管理数据仓库 */
  protected get store(): storeFile {
    throw new Error('File: 必须重写store以提供文件管理数据仓库!')
  }

  protected get task() {
    let task: any = this.isDel
    this.store.ADD_TASK({
      task: {
        task: {
          url: this.href,
          query: this.query,
          name: this.fileName,
        },
        state: STATE.pause,
      },
      callback(t) {
        task = t
      },
    })
    return task as ITask
  }

  /// [LifeCycle] (private beforeCreate(){}/.../destroyed(){}) ///
  private activated() {
    this.isSleep = false
  }

  private deactivated() {
    this.isSleep = true
  }

  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {}) ///
  /// [methods] (method(){}) ///
  protected load() {
    this.store.SET_STATE({
      task: this.task as ITask,
      state: STATE.loading,
    })
  }

  protected save() {
    this.store.SAVE(this.task as ITask)
  }

  protected reLoad() {
    this.isDel++
  }

  // see: https://github.com/vuejs/jsx#installation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected render(h: CreateElement) {
    if (this.isSleep) {
      return this.$_vnode
    }

    const text = this.text || this.$slots.default
    const icon = this.icon // TODO: 未指定图标时根据文件名后缀设置图标

    switch (this.task.state) {
      case STATE.del:
        return (this.$_vnode = (
          <ElLink
            type="info"
            icon={icon}
            disabled={this.disabled}
            on={{ click: this.reLoad }}
          >
            {text}
          </ElLink>
        ))
      case STATE.wait:
        return (this.$_vnode = (
          <ElLink disabled type="warning" icon="el-icon-more-outline">
            {text}
          </ElLink>
        ))
      case STATE.loading:
        return (this.$_vnode = (
          <ElLink disabled type="success" icon="el-icon-loading">
            {text}
          </ElLink>
        ))
      case STATE.pause:
        return (this.$_vnode = (
          <ElLink
            type="primary"
            icon={icon}
            disabled={this.disabled}
            on={{ click: this.load }}
          >
            {text}
          </ElLink>
        ))
      case STATE.failed:
        return (this.$_vnode = (
          <ElLink
            type="danger"
            icon="el-icon-refresh-right"
            on={{ click: this.load }}
          >
            {text}
          </ElLink>
        ))
      case STATE.success:
        this.save() // 下载完成自动保存
      // eslint-disable-next-line no-fallthrough
      default:
        return (this.$_vnode = (
          <ElLink icon={icon} on={{ click: this.save }}>
            {text}
          </ElLink>
        ))
    }
  }
}
