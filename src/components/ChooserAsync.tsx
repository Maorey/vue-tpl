/**
 * @Description: 组件选择器(异步) 比如: Ajax完成后才知道该使用哪个组件
 * @Author: 毛瑞
 * @Date: 2020-01-02 16:13:36
 */
/// 【示例】 ///
/* <template>
  <div>
    <ChooserAsync :get="get">
      <template #default="{ data }">
        <textarea :value="JSON.stringify(data)" />
      </template>
    </ChooserAsync>
  </div>
</template> */
import { CreateElement, Component as Comp } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import Info from './Info'
import Loading from './Loading'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )
export const enum status {
  none = 1,
  loading,
  error,
  empty,
}
type component = status | string | Comp
type filter = (data: any) => { data: any; comp: component } | void

/// 选项 name,directives,filters,extends,mixins ///
/** 异步选择器组件(functional) 支持默认插槽/默认作用域插槽 二选一(二者都有无法确定顺序)
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
  /** 选择组件函数 若字典存在, 返回的comp属性为字符串, 则优先从字典取
   */
  @Prop() readonly error?: status | ((err: Error) => component)
  /** 组件字典 当filter返回string时即从字典取对应组件
   */
  @Prop() readonly components?: IObject<Comp>
  /// [data] (attr: string = '响应式属性' // 除了 undefined) ///
  private is: component = status.loading
  /// 非响应式属性 (attr?: string // undefined) ///
  private d?: any // 原始响应数据
  private data?: any // 绑定数据
  /// [computed] (get attr() {} set attr(){}) ///
  /// [LifeCycle] (private beforeCreate(){}/.../destroyed(){}) ///
  private created() {
    this.i()
  }

  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {}) ///
  /// [methods] (method(){}) ///
  @Watch('get')
  private i() {
    this.is = status.loading
    // eslint-disable-next-line prefer-promise-reject-errors
    ;(this.get ? this.get() : Promise.reject())
      .then(data => {
        this.d = data
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
    const data = this.d
    if (data) {
      const DIC = this.components
      const tag = this.tag
      if (!this.filter) {
        this.data = { props: { data } }
        this.is = (DIC && DIC[tag as string]) || tag
        return
      }

      const result = this.filter(data)
      if (result) {
        this.data = { props: { data: result.data || result } }
        this.is = (DIC && DIC[result.comp as string]) || result.comp || tag
        return
      }
    }

    this.is = status.empty
  }

  // see: https://github.com/vuejs/jsx#installation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private render(h: CreateElement) {
    const Comp: any = this.is
    let temp: any
    switch (Comp) {
      case status.none:
        this.$emit('none')
        return
      case status.loading:
        this.$emit('loading')
        return <Loading />
      case status.empty:
        this.$emit('empty')
        return <Info icon="el-icon-info" type="info" msg="empty" retry="" />
      case status.error:
        return <Info on={{ $: this.i }} />
      default:
        this.$emit('success')
        return (
          <Comp {...this.data}>
            {this.$slots.default ||
              ((temp = this.$scopedSlots.default) && temp(this.data.props))}
          </Comp>
        )
    }
  }
}
