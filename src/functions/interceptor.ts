/** 响应拦截器 */
// import Message from 'element-ui/lib/message'
// import MessageBox from 'element-ui/lib/message-box'
// ↑因scss注入问题，应在合适的地方引入组件对应的scss，比如页面入口

function success(res: any) {
  return res
}

function failed(res: any) {
  throw res
}

export { success, failed }
