/**
 * @Description: 组件选择器(异步) 比如: Ajax完成后才知道该使用哪个组件
 * @Author: 毛瑞
 * @Date: 2020-01-02 16:13:36
 */
import { CreateElement, Component as Comp } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import Info from './Info'
import Loading from './Loading'
import { VNode } from 'vue/types/umd'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )
export const enum status {
  none = 1,
  loading = 2,
  error = 3,
  empty = 4,
}
type component = status | string | Comp
type filter = (data: any) => { data: any; comp: component } | void

/// 选项 name,directives,filters,extends,mixins ///
/** 异步选择器组件, 最终渲染组件将得到一个prop: data, 即异步结果
 *
 *  props: 见: @Prop 【注意】: get/error 变化时会重新请求
 *  events: 见: const enum status 键值
 *  slots: 支持默认插槽/默认作用域插槽 二选一 (二者都有时无法确定顺序, 所以只能二选一)
 *  示例:
 *  <template>
 *    <ChooserAsync :get="get" @error="handleError">
 *      <template #default="{ data }">
 *        <textarea :value="JSON.stringify(data)" />
 *      </template>
 *    </ChooserAsync>
 *  </template>
 * ( import 咋没得文档呢, 因为tsx么... ┐(: ´ ゞ｀)┌ )
 */
@Component
export default class extends Vue {
  /// [model] (@Model('change') readonly attr!: string) ///
  /// [props] (@Prop() readonly attr!: string) ///
  /** 未匹配到任何组件但有数据时使用的组件[默认‘div’] 若字典存在, tag为字符串, 则优先从字典取
   */
  @Prop({ default: 'div' }) readonly tag!: component
  /** 查询函数
   */
  @Prop() readonly get?: () => Promise<IObject>
  /** 选择组件函数 若字典存在, 返回的comp属性为字符串, 则优先从字典取
   */
  @Prop() readonly filter?: filter
  /** 自定义处理查询错误时的展示(接受参数为错误对象)
   */
  @Prop() readonly error?: status | ((err: Error) => component)
  /** 组件字典 当filter返回string时即从字典取对应组件
   */
  @Prop() readonly components?: IObject<Comp>
  /// [data] (attr: string = '响应式属性' // 除了 undefined) ///
  private is: component = status.loading
  private isSleep = false // 是否失活/休眠
  /// 非响应式属性 (attr?: string // undefined) ///
  private $_response?: any // 原始响应数据
  private $_data?: any // 绑定数据
  private $_vnode?: VNode
  /// [computed] (get attr() {} set attr(){}) ///
  /// [LifeCycle] (private beforeCreate(){}/.../destroyed(){}) ///
  private created() {
    this.i()
  }

  private activated() {
    this.isSleep = false
  }

  private deactivated() {
    this.isSleep = true
  }

  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {}) ///
  /// [methods] (method(){}) ///
  @Watch('get')
  private i() {
    this.is = status.loading
    // eslint-disable-next-line prefer-promise-reject-errors
    ;(this.get ? this.get() : Promise.reject())
      .then(data => {
        this.$_response = data
        this.w()
      })
      .catch(err => {
        this.is =
          (typeof this.error === 'function' ? this.error(err) : this.error) ||
          status.error
      })
  }

  @Watch('tag')
  @Watch('filter')
  @Watch('components')
  private w() {
    const data = this.$_response
    if (data) {
      const DIC = this.components
      const tag = this.tag
      if (!this.filter) {
        this.$_data = { props: { data } }
        this.is = (DIC && DIC[tag as string]) || tag
        return
      }

      const result = this.filter(data)
      if (result) {
        this.$_data = { props: { data: result.data || result } }
        this.is = (DIC && DIC[result.comp as string]) || result.comp || tag
        return
      }
    }

    this.is = status.empty
  }

  // see: https://github.com/vuejs/jsx#installation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private render(h: CreateElement) {
    const Comp: any = this.is // for 依赖收集
    // for 依赖收集 失活返回缓存
    if (this.isSleep) {
      return this.$_vnode
    }

    let temp: any
    switch (Comp) {
      case status.none:
        this.$emit('none')
        return (this.$_vnode = undefined)
      case status.loading:
        this.$emit('loading')
        return (this.$_vnode = <Loading />)
      case status.empty:
        this.$emit('empty')
        return (this.$_vnode = (
          <Info icon="el-icon-info" type="info" msg="empty" retry="" />
        ))
      case status.error:
        this.$emit('error')
        return (this.$_vnode = <Info on={{ $: this.i }} />)
      default:
        this.$emit('success')
        return (this.$_vnode = (
          <Comp {...this.$_data}>
            {this.$slots.default ||
              ((temp = this.$scopedSlots.default) && temp(this.$_data.props))}
          </Comp>
        ))
    }
  }
}
