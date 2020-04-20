/*
 * @Description: 图片展示 (图片文件需要授权)
 * @Author: 毛瑞
 * @Date: 2020-03-02 13:25:23
 */
import { CreateElement, VNode } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from 'vue-property-decorator'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import Info from './Info'

import { isPassive } from '@/utils'
import { debounce } from '@/utils/performance'
import storeImage, { STATE, ITask } from '@/store/image'

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
  @Prop() readonly src!: string
  /** 查询参数 */
  @Prop() readonly query?: IObject
  /** 同 <img alt> */
  @Prop() readonly alt?: string
  /** 滚动容器选择器(document.querySelector), 若设置则懒加载 */
  @Prop() readonly el?: string
  /// [data] (attr: string = '响应式属性' // 除了 undefined) ///
  private isSleep = false // 是否失活/休眠
  private isDel = 0
  /// 非响应式属性 (attr?: string // undefined) ///
  private $_vnode?: VNode
  /// [computed] (get attr() {} set attr(){}) ///
  /** 【必须重写】文件管理数据仓库 */
  protected get store(): storeImage {
    throw new Error('Image: 必须重写store以提供图片管理数据仓库!')
  }

  protected get task() {
    let task
    this.isDel &&
      this.store.LOAD({
        task: { url: this.src, query: this.query },
        callback(t) {
          task = t
        },
      })
    return (task as any) as ITask
  }

  /// [LifeCycle] (private beforeCreate(){}/.../destroyed(){}) ///
  private created() {
    if (this.el) {
      const el = document.querySelector(this.el)
      if (el) {
        const onScroll = debounce(() => {
          if (this.isDel) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return removeListener()
          }

          const top = el.scrollTop
          const bottom = top + el.clientHeight

          const left = el.scrollLeft
          const right = left + el.clientWidth

          const dom = this.$el as HTMLElement
          const y = dom.offsetTop // + (dom.offsetHeight >> 1)
          const x = dom.offsetLeft // + (dom.offsetWidth >> 1)

          if (y > top && y < bottom && x > left && x < right) {
            this.isDel++
          }
        }, 99)
        const removeListener = () => {
          el.removeEventListener('scroll', onScroll)
        }
        el.addEventListener('scroll', onScroll, isPassive())
        this.$on('hook:destroyed', removeListener)
        return this.$nextTick(onScroll)
      }
    }
    this.isDel++
  }

  private activated() {
    this.isSleep = false
  }

  private deactivated() {
    this.isSleep = true
  }

  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {}) ///
  /// [methods] (method(){}) ///
  protected reLoad() {
    this.isDel++
  }

  // see: https://github.com/vuejs/jsx#installation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private render(h: CreateElement) {
    const task = this.task
    if (this.isSleep || !task) {
      return this.$_vnode || (this.$_vnode = <i />)
    }

    switch (task.state) {
      case STATE.drop:
        return (this.$_vnode = (
          <Info
            icon="el-icon-picture-outline"
            type="info"
            msg={this.alt}
            retry="重新加载图片"
            on={{ $: this.reLoad }}
          />
        ))
      case STATE.wait:
        return (this.$_vnode = (
          <Info
            icon="el-icon-picture"
            type="warn"
            msg={this.alt}
            retry="请稍候"
          />
        ))
      case STATE.loading:
        return (this.$_vnode = (
          <Info
            icon="el-icon-picture"
            type="primary"
            msg={this.alt}
            retry="加载中"
          />
        ))
      case STATE.failed:
        return (this.$_vnode = (
          <Info
            icon="el-icon-picture-outline"
            msg={this.alt}
            on={{ $: this.reLoad }}
          />
        ))
      default:
        return (this.$_vnode = <img src={task.src} alt={this.alt} />)
    }
  }
}
