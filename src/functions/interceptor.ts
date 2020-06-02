/** 响应拦截器 */
import Message from 'element-ui/lib/message'
import MessageBox from 'element-ui/lib/message-box'
// ↑因scss注入问题，应在合适的地方引入组件对应的scss，比如页面入口

import { API_CODE } from '@/enums'

import CONFIG from '@/config'
const gotoLogin = () => {
  CONFIG.g()
}

function success(res: any) {
  const data = res.data
  const code = data.code
  switch (code) {
    case API_CODE.success:
    case API_CODE.MODIFY_PASSWORD:
    case !code && code:
      return res
    case API_CODE.SESSION_NOT_LOGIN:
      return gotoLogin()
    case API_CODE.SESSION_NOT_CSRF:
    case res.status === API_CODE.unauthorized && code:
      try {
        MessageBox.close()
      } catch (error) {}
      MessageBox.confirm(
        data.msg || '登录超时，您可以继续留在当前页面，或者重新登录',
        '需要登录',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '登录',
        }
      ).then(gotoLogin)
      res._ = 1 // 已捕获
  }
  throw res
}

function failed(res: any) {
  if (res._) {
    throw res
  }

  const response = res.response || {}
  response.data || (response.data = {})
  res.data || (res.data = response.data)
  // 兼容抛出http错误的情况...
  try {
    res = success(res)
  } catch (error) {}
  if (res._) {
    throw res
  }

  Message.closeAll()
  Message.error(
    res.code === API_CODE.timeout
      ? '请求超时, 请稍候再试'
      : (res.data || res).msg || '发生错误, 请检查操作'
  )
  throw res
}

export { success, failed }
