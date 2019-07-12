/*
 * @Description: 模块申明
 * @Author: 毛瑞
 * @Date: 2019-07-09 16:19:51
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-12 23:31:41
 */

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.module.scss' {
  /** parsed class names with css-loader option, indexing by class selector names (must camelCase) in scss
   */
  const content: {
    [className: string]: string
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
// 需要配置loader,否则会 eval(内容)
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
