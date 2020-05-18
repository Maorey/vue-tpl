# 第三方组件增强/修改/装饰器

## 目的

1. 适配第三方组件的【全局】使用需求
2. 修复第三方组件的 bug

## 注意事项

1. 尽量仅包装目标, 不应影响原有行为, 不适用的情况时应采用: 高阶组件包装 扩展 甚至重写组件 的方式(作为新的组件使用放对应组件目录)
2. 类型统一为: `function <T>fooDecorator(component: T): T`
3. 获取 Vue 组件选项时应使用 `component.options || component`, 前者为 class 组件, 后者为 options 组件
