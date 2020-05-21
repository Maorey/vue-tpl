/** Vue hack/inject */
import Vue, { VueConstructor, Component, AsyncComponent } from 'vue'

/** 添加vue监听(插入到最前面)
 * @param {Object} options 监听对象
 * @param {String} hook 监听事件
 * @param {Function} fn 监听回调
 * @param {Object} scope [可选]绑定回调的this
 */
function setHook(
  options: any,
  hook: string,
  fn: Function | Function[],
  scope?: any
) {
  let originHook: any
  if (Array.isArray(fn)) {
    for (originHook of fn) {
      setHook(options, hook, originHook, scope)
    }
    return
  }

  if ((originHook = options[hook])) {
    if (
      (Array.isArray(originHook) && originHook.includes((fn as any)._ || fn)) ||
      originHook === ((fn as any)._ || fn)
    ) {
      return
    }

    originHook = [originHook]
  } else {
    originHook = []
  }

  if (arguments.length > 3) {
    scope = fn.bind(scope)
    scope._ = fn
    fn = scope
  }
  originHook.unshift(fn)
  options[hook] = originHook
}

function onWake(this: any, to: any, from: any, next: any) {
  this.s_ = 0
  next && setTimeout(next)
}
function onSleep(this: any, to: any, from: any, next: any) {
  if (next) {
    this.s_ = to.matched.length && 1 // for 刷新
    setTimeout(next)
  } else {
    this.s_ = 1
  }
}
/** 对路由组件、<KeepAlive>的组件注入睡眠(装饰器)
 * @param {Component} component 组件选项
 */
function sleep(component: Component | AsyncComponent) {
  const options = (component as any).options || component
  const originRender = options.render
  if (!originRender || options._$s) {
    return component
  }
  options._$s = 1

  if (options.functional) {
    const store = Vue.observable({ s_: 0 })
    let vnode: any
    options.render = function(h: any, context: any) {
      if (store.s_) {
        return vnode
      }

      let on = context.data
      on = on.on || (on.on = {})
      setHook(on, 'hook:activated', onWake, store)
      setHook(on, 'hook:deactivated', onSleep, store)
      return (vnode = originRender.apply(this, arguments))
    }
  } else {
    // mixins这个阶段对class based api无效
    const originData = options.data
    options.data = function() {
      const data =
        (originData && originData.apply && originData.apply(this, arguments)) ||
        {}
      data.s_ = 0 // 满足/^[&_]/不能转化为响应式属性
      return data
    }
    setHook(options, 'beforeRouteUpdate', onWake) // 非hook, 只能实例化前赋值
    setHook(options, 'activated', onWake)
    setHook(options, 'beforeRouteLeave', onSleep)
    setHook(options, 'deactivated', onSleep)
    options.render = function() {
      if (this.s_) {
        return this._$n
      }
      return (this._$n = originRender.apply(this, arguments))
    }
  }

  return component
}

/** 开发环境注入 */
function dev(Vue: VueConstructor) {
  // 在浏览器开发工具的性能/时间线面板中启用Vue组件性能追踪 && 更友好的组件名(vue-devtool)
  ;(Vue.config.performance = process.env.NODE_ENV === 'development') &&
    Vue.mixin({
      beforeCreate() {
        let options
        options = this.$options
        options ||
          ((options = this.$vnode) &&
            (options = options.componentOptions) &&
            (options = options.Ctor) &&
            (options = (options as any).options))

        // 匿名组件就不处理了 vue-devtool自己找 $vm0.$options.__file
        if (options && options.__file && /^default/i.test(options.name)) {
          const result = /(?:[\\/]([^\\/]+)[\\/])?([^\\/]+)(?:[\\/]index)?\.\w+/.exec(
            options.__file
          )
          result && (options.name = result[1] + result[2])
        }
      },
    })
}

export { setHook, sleep, dev }
