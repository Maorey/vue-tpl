/**
 * @Description: 组件选择器(异步) 比如: Ajax完成后才知道该使用哪个组件
 * @Author: 毛瑞
 * @Date: 2020-01-02 16:13:36
 */
import { CreateElement, VNode } from 'vue'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@com/hoc'
// import STYLE from './index.module.scss'
import Info from './Info'
import Loading from './Loading'
import { status, component, filter, MAP } from './ChooserAsyncFunctional'

import { isDef, isFn, isEqual } from '@/utils'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )
export { status, component, filter }

/** 异步选择器组件(兼容同步), 最终渲染组件将得到一个prop: data(同步时值为1), 即异步结果
 *
 *  props: 见: Prop 【注意】: 响应任意prop变化
 *
 *  slots: 见: const enum status 键值, 支持对应作用域插槽(优先)/插槽【二选一】(二者都有时无法确定顺序, 故)
 *
 *  events: 见: const enum status 键值
 *
 *  示例:
 *  <template>
 *    <Async :fetch="fetch" :args="args" @error="handleError">
 *      <template #error>出错了</template>
 *      <!-- 同 #default 【二选一】 -->
 *      <template #success="{ data }">
 *        <textarea>{{ JSON.stringify(data) }}</textarea>
 *      </template>
 *    </Async>
 *  </template>
 *
 * ( import 咋没得文档呢, 因为tsx么... ┐(: ´ ゞ｀)┌ )
 */
@Component({
  beforeRouteUpdate(this: any, to, from, next) {
    this.isOut = 0
    setTimeout(next)
  },
  beforeRouteLeave(this: any, to: any, from: any, next: any) {
    this.isOut = to.matched.length && 1
    setTimeout(next)
  },
})
export default class extends Vue {
  /// [model] (@Model('change') readonly attr!: string) ///
  /// [props] (@Prop() readonly attr!: string) ///
  /** 查询函数 diff:fetch,args ? fetch.apply(store, args) */
  @Prop() readonly fetch?: (...args: any[]) => Promise<any>
  /** 查询函数参数列表 */
  @Prop() readonly args?: any[]
  /** 查询函数 get.call(store), 同 (fetch + args) */
  @Prop() readonly get?: () => Promise<any>
  /** 查询错误处理 store.error(err) */
  @Prop() readonly error?: status | ((err?: Error) => component)
  /** 未匹配到任何组件但有数据时使用的组件[默认div] */
  @Prop({ default: 'div' }) readonly tag!: component
  /** 数据&组件筛选 store.filter(data) */
  @Prop() readonly filter?: filter
  /** 组件字典[优先使用] */
  @Prop() readonly components?: { [name: string]: component }
  /// [data] (attr: string = '响应式属性' // 除了 undefined) ///
  private is: component = status.loading
  private isOut = 0 // 是否失活/离开
  /// 非响应式属性 (attr?: string // undefined) ///
  private $_response?: any // 原始响应数据
  private $_data?: any // 绑定数据
  private $_vnode?: VNode
  private $_isGet?: false | 1 | 2
  private $_onError?: (err?: Error) => void
  /// [computed] (get attr() {} set attr(){}) ///
  /// [LifeCycle] (private beforeCreate(){}/.../destroyed(){}) ///
  private created() {
    this.g()
  }

  private activated() {
    this.isOut = 0
  }

  private deactivated() {
    this.isOut = 1
  }

  /// [watch] (@Watch('attr') onAttrChange(val, oldVal) {}) ///
  /// [methods] (method(){}) ///
  @Watch('tag')
  @Watch('filter')
  @Watch('components', { deep: true })
  private w() {
    let data = this.$_response
    if (isDef(data)) {
      const DIC = this.components
      if (isFn(this.filter)) {
        if (isDef((data = this.filter(data)))) {
          this.$_data = { data: data.data || data }
          this.is = (DIC && DIC[data.comp]) || data.comp || this.tag
        } else {
          this.is = status.empty
        }
      } else {
        this.$_data = { data }
        this.is = (DIC && DIC[this.tag as string]) || this.tag
      }
    } else {
      this.is = status.empty
    }
  }

  @Watch('error')
  private e() {
    const onError =
      this.$_onError ||
      (this.$_onError = (err?: Error) => {
        this.is =
          (isFn(this.error) ? this.error(err) : this.error) || status.error
      })
    if (this.$_isGet) {
      this.is = status.loading
      ;(this.$_isGet > 1
        ? (this.fetch as any).apply(this, this.args)
        : (this as any).get()
      )
        .then((data: any) => {
          this.$_response = data
          this.w()
        })
        .catch(onError)
    } else if (this.error) {
      onError()
    } else {
      this.$_response = 1 // 兼容同步
      this.w()
    }
  }

  @Watch('get')
  private g() {
    this.$_isGet = isFn(this.get) ? 1 : isFn(this.fetch) && 2
    this.e()
  }

  @Watch('fetch')
  private f() {
    this.$_isGet = isFn(this.fetch) ? 2 : isFn(this.get) && 1
    this.e()
  }

  @Watch('args', { deep: true })
  private a(now?: any, old?: any) {
    isEqual(now, old) || this.f()
  }

  // see: https://github.com/vuejs/jsx#installation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private render(h: CreateElement) {
    if (this.isOut) {
      return this.$_vnode
    }

    let Comp: any = this.is // for 依赖收集
    let slot
    if ((slot = (MAP as any)[Comp])) {
      this.$emit(slot)
      slot = this.$scopedSlots[slot]
        ? (this.$scopedSlots[slot] as any)(this.$_data)
        : this.$slots[slot]
      if (slot && slot.length) {
        Comp = this.tag
        return (this.$_vnode = <Comp on={{ $: this.e }}>{slot}</Comp>)
      }
    }

    switch (Comp) {
      case status.none:
        return (this.$_vnode = <i style="display:none" />)
      case status.loading:
        return (this.$_vnode = <Loading />)
      case status.empty:
        return (this.$_vnode = (
          <Info icon="el-icon-info" type="info" msg="empty" retry="" />
        ))
      case status.error:
        return (this.$_vnode = <Info on={{ $: this.e }} />)
      default:
        this.$emit('success')
        slot = this.$scopedSlots
        slot = slot.success || slot.default
        Object.assign(this.$data.props || (this.$data.props = {}), this.$_data)
        return (this.$_vnode = (
          <Comp {...this.$data}>
            {slot
              ? slot(this.$_data)
              : (slot = this.$slots).success || slot.default}
          </Comp>
        ))
    }
  }
}
