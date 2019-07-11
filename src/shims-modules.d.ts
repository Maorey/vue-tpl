/*
 * @Description: 模块申明
 * @Author: 毛瑞
 * @Date: 2019-07-09 16:19:51
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-11 12:52:27
 */
declare module '*.jpeg' {
  const content: any
  export = content
}
declare module '*.jpg' {
  const content: any
  export = content
}
declare module '*.png' {
  const content: any
  export = content
}
declare module '*.svg' {
  const content: any
  export = content
}
declare module '*.gif' {
  const content: any
  export = content
}
declare module '*.text' {
  const content: any
  export default content
}
declare module '*.json' {
  const content: any
  export default content
}
declare module '*.css' {
  const content: any
  export default content
}

declare module '*.scss' {
  const content: any
  export = content
}

declare module '*.module.scss' {
  const content: any
  export = content
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
