/* 模块申明 */

declare namespace NodeJS {
  interface Process extends __WebpackModuleApi.NodeProcess {
    /** 环境变量, 定义常用的几个 */
    env: {
      /** 运行模式 */
      NODE_ENV: 'development' | 'production' | 'test'
      /** 静态资源路径 */
      BASE_URL: string
      /** 皮肤全局变量名, 同时也是消息总线事件名 */
      SKIN_FIELD: string
      /** 当前入口(SPA)名 */
      ENTRIES: string[]
      /** 入口及其指定的别名指令 */
      ALIAS: { [key: string]: string[] }
      [key: string]: any
    }
  }
}

declare module '*.module.scss' {
  /** css 模块
   */
  const content: {
    [localClassName: string]: string
  }
  export default content
}
declare module '*.scss' {
  /** scss 导出 (:export{})
   */
  const content: {
    [className: string]: string
  }
  export default content
}
declare module '*.css' {
  /** 一个空对象
   */
  const content: object
  export default content
}
declare module '*.png' {
  /** 图片路径或base64字符串
   */
  const content: string
  export = content
}
declare module '*.gif' {
  /** 图片路径或base64字符串
   */
  const content: string
  export = content
}
declare module '*.jpg' {
  /** 图片路径或base64字符串
   */
  const content: string
  export = content
}
declare module '*.jpeg' {
  /** 图片路径或base64字符串
   */
  const content: string
  export = content
}
declare module '*.svg' {
  /** 文件路径
   */
  const content: string
  export = content
}
declare module '*.json' {
  /** 得到json表达的对象/数组【混入到代码中】
   */
  const content: object | any[]
  export default content
}

// 需要配置loader,否则会当成js eval(内容)
// declare module '*.text' {
//   /** 文件内容
//    */
//   const content: string
//   export = content
// }
// declare module '*.txt' {
//   /** 文件内容
//    */
//   const content: string
//   export = content
// }

// declare module '*.vue' {
//   import Vue from 'vue'
//   export default Vue
// }

// declare module '*.tsx' {
//   import Vue from 'vue'
//   export default Vue
// }

/// web workers ///
declare function postMessage(message: any): void
declare interface WebpackWorker {
  new (): Worker
}
declare module 'worker-loader!*' {
  export default WebpackWorker
}

// declare module 'element-ui/lib/*' {
//   import Vue, { PluginFunction, PluginObject } from 'vue'

//   const plugin: PluginObject<Vue> | PluginFunction<Vue>
//   export default plugin
// }
// declare module 'zrender/lib/*'
// declare module 'zdog/js/*'
// declare module 'luma.gl'
// declare module 'math.gl'
// declare module '@luma.gl/addons'
declare module '*'

declare type Falsy = false | 0 | 0n | '' | null | undefined | void // | NaN
/** 任意对象 */
declare interface IObject<T = any> {
  [key: string]: T
  [key: number]: T
}

// hack ECharts for switch skin
declare namespace echarts {
  interface EChartOption {}
  interface EChartsResponsiveOption {}
  interface ECharts {
    setOption(
      option: () => EChartOption | EChartsResponsiveOption,
      notMerge?: boolean,
      lazyUpdate?: boolean
    ): void
  }
}
